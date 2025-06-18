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
    Tries to fetch both manual and auto-generated English transcripts.
    Returns friendly error messages if transcript is unavailable.
    """
    try:
        # First try getting the default transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry["text"] for entry in transcript])

    except NoTranscriptFound:
        try:
            # Try to find English auto-generated transcript
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript = transcript_list.find_transcript(['en'])
            generated = transcript.fetch()
            return " ".join([entry["text"] for entry in generated])
        except Exception as e:
            return f"Transcript not available: {str(e)}"

    except TranscriptsDisabled:
        return "Transcript not available: Transcripts are disabled for this video."
    except VideoUnavailable:
        return "Transcript not available: The video is unavailable."
    except Exception as e:
        return f"An error occurred: {str(e)}"
