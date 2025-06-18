from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import summarize_text
from youtube_utils import extract_video_id, get_transcript

app = Flask(__name__)
CORS(app)

# Clean transcript function
def clean_transcript(text):
    lines = text.split('\n')
    unique_lines = list(dict.fromkeys(lines))
    return " ".join(unique_lines)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    url = data.get("url")

    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        transcript = get_transcript(video_id)

        # 🔥 Check if transcript is actually valid
        if "Transcript not available" in transcript or "An error occurred" in transcript:
            return jsonify({"error": transcript}), 400

        cleaned_transcript = clean_transcript(transcript)
        raw_summary = summarize_text(cleaned_transcript)

        # ✅ Clean up summary bullets properly
        bullet_points = list(dict.fromkeys([
            f"• {line.strip().lstrip('•').strip()}" 
            for line in raw_summary.split('.') 
            if line.strip()
        ]))

        summary = "\n".join(bullet_points)

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
