import re
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable
)

def extract_video_id(url):
    """
    Extracts the YouTube video ID from various YouTube URL formats.
    """
    if not url:
        return None

    # Match standard, short, embed, and shorts YouTube URLs
    pattern = r"(?:https?://)?(?:www\.)?(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([^\s&?/]+)"
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    return None


def get_transcript(video_id):
    """
    Retrieves and concatenates the transcript for the given YouTube video ID.
    Tries to get English first, then falls back to translation if available.
    """
    try:
        # Try native English transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        full_text = " ".join([entry["text"] for entry in transcript])
        return full_text

    except NoTranscriptFound:
        try:
            # Try fallback and translate
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            fallback_transcript = transcript_list.find_transcript(['de', 'es', 'fr', 'it'])

            if fallback_transcript.is_translatable:
                translated = fallback_transcript.translate('en').fetch()
                full_text = " ".join([entry.text for entry in translated])  # ✅ FIXED LINE
                return full_text
            else:
                return "Transcript not available: Transcript is not translatable to English."

        except Exception as e:
            return f"Transcript not available: {str(e)}"

    except TranscriptsDisabled:
        return "Transcript not available: Transcripts are disabled for this video."
    except VideoUnavailable:
        return "Transcript not available: The video is unavailable."
    except Exception as e:
        return f"An error occurred: {str(e)}"
