from transformers import pipeline
import re

# Load the model only once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text, max_length=130, min_length=40):
    """
    Summarizes the input transcript text into bullet points.
    Handles long transcripts via chunking.
    """
    if not text.strip():
        return "⚠️ Empty transcript."

    prompt = (
        "Summarize the following transcript into clear, non-repetitive bullet points in natural English:\n\n"
    )

    # Split into chunks for large inputs
    chunk_size = 1000
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    partial_summaries = []

    for chunk in chunks:
        full_text = prompt + chunk
        summary = summarizer(full_text, max_length=max_length, min_length=min_length, do_sample=False)
        partial_summaries.append(summary[0]['summary_text'].strip())

    # Combine and format
    final_summary = " ".join(partial_summaries)
    return format_as_bullets(final_summary)

def format_as_bullets(summary_text):
    """
    Formats sentences into clean bullet points.
    """
    # Split by period followed by space or end of line
    sentences = re.split(r'\.\s+|\.\Z', summary_text.strip())
    bullets = [f"• {s.strip().rstrip('.')}" for s in sentences if s.strip()]
    return "\n".join(bullets)
