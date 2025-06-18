from transformers import pipeline

# Load the summarization model once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text, max_length=180, min_length=80):
    """
    Summarizes the transcript text into 4–6 concise bullet points.
    Automatically chunks long transcripts.
    """
    # Chunking for long transcripts
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    summaries = []

    for chunk in chunks:
        result = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
        summaries.append(result[0]["summary_text"].strip())

    combined = " ".join(summaries)
    return format_as_bullets(combined)


def format_as_bullets(summary_text):
    """
    Formats each sentence or paragraph into a bullet point.
    """
    import re
    lines = re.split(r'\.\s+', summary_text.strip())
    bullets = [f"• {line.strip().rstrip('.')}" for line in lines if line.strip()]
    return "\n".join(bullets)
