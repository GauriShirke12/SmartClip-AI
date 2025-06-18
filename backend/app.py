from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import CouldNotRetrieveTranscript
from summarizer import summarize_text
from urllib.parse import urlparse, parse_qs
from googletrans import Translator

app = Flask(__name__)
CORS(app)

# Helper to extract video ID
def extract_video_id(url):
    query = urlparse(url)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    elif query.hostname in ('www.youtube.com', 'youtube.com'):
        return parse_qs(query.query).get('v', [None])[0]
    return None

# Fetch transcript and translate if needed
def fetch_transcript(video_id):
    try:
        # Try fetching English transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        text = " ".join([entry['text'] for entry in transcript])
        return text

    except Exception:
        try:
            # Try alternative transcript (manual or auto)
            transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

            transcript = transcripts.find_transcript(
                list(transcripts._manually_created_transcripts.keys()) or
                list(transcripts._generated_transcripts.keys())
            )

            transcript_data = transcript.fetch()
            text = " ".join([entry['text'] for entry in transcript_data])

            # Translate to English if needed
            if transcript.language_code != 'en':
                translator = Translator()
                translated = translator.translate(text, src=transcript.language_code, dest='en')
                return translated.text
            else:
                return text

        except Exception as e:
            raise RuntimeError(f"Transcript not available in any language: {str(e)}")

# Main API route
@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    video_url = data.get("url")

    if not video_url:
        return jsonify({"error": "URL is required"}), 400

    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        transcript_text = fetch_transcript(video_id)
        summary = summarize_text(transcript_text)
        return jsonify({"summary": summary})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred: " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
