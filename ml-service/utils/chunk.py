from typing import List, Dict, Any

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> List[Dict[str, Any]]:
    if not text or not text.strip():
        return []
    words = text.split()
    total_words = len(words)
    chunks = []
    if total_words <= chunk_size:
        return [{"chunk_index": 0, "text": text, "word_count": total_words}]

    start = 0
    chunk_index = 0
    while start < total_words:
        end = min(start + chunk_size, total_words)
        chunk_words = words[start:end]
        chunks.append({
            "chunk_index": chunk_index,
            "text": " ".join(chunk_words),
            "word_count": len(chunk_words)
        })
        chunk_index += 1
        start += (chunk_size - chunk_overlap)
        if chunk_overlap >= chunk_size:
            break
    return chunks