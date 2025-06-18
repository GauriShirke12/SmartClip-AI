from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptAvailable, VideoUnavailable
from googletrans import Translator  # Add this

def fetch_transcript(video_id):
    try:
        # Get transcript list (includes all languages and auto-generated)
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try to get English first
        try:
            transcript = transcript_list.find_transcript(['en'])
        except:
            # Else get ANY transcript (even auto-generated)
            transcript = transcript_list.find_transcript(['hi', 'de', 'es', 'fr', 'auto'])

        # Fetch the transcript text
        transcript_data = transcript.fetch()

        # Join into plain text
        text = " ".join([entry['text'] for entry in transcript_data])

        # Translate to English if not already
        if transcript.language_code != 'en':
            print(f"Translating from {transcript.language_code} to English...")
            translator = Translator()
            text = translator.translate(text, src=transcript.language_code, dest='en').text

        return text

    except (TranscriptsDisabled, NoTranscriptAvailable, VideoUnavailable) as e:
        return f"Transcript not available: {str(e)}"
