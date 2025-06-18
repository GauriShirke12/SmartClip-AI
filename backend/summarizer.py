from transformers import pipeline

# Load the summarization model once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text, max_length=180, min_length=80):
    """
    Summarizes the transcript text into 4–6 concise bullet points.
    Automatically chunks long transcripts.
    """
    prompt = (
        "Summarize the following transcript into 4-6 concise bullet points covering the main topics and objectives:\n\n" + text
    )
    
    chunks = [prompt[i:i+1000] for i in range(0, len(prompt), 1000)]
    summary = ""
    for chunk in chunks:
        result = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
        summary += result[0]["summary_text"].strip() + "\n"
    
    return format_as_bullets(summary.strip())


def format_as_bullets(summary_text):
    """
    Formats each sentence or paragraph into a bullet point.
    """
    lines = summary_text.split('. ')
    bullets = [f"• {line.strip().rstrip('.')}" for line in lines if line.strip()]
    return "\n".join(bullets)
