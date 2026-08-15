import chromadb
from sentence_transformers import SentenceTransformer
from config import settings
from utils.chunk import chunk_text

class VectorDBService:
    def __init__(self):
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        self.client = chromadb.PersistentClient(path=str(settings.CHROMA_DIR))

    def index_lecture(self, text: str, lecture_id: str) -> int:
        chunks = chunk_text(text, settings.CHUNK_SIZE, settings.CHUNK_OVERLAP)
        if not chunks: return 0
        col = self.client.get_or_create_collection(name=f"lecture_{lecture_id}")
        col.upsert(
            documents=[c["text"] for c in chunks],
            embeddings=self.embedding_model.encode([c["text"] for c in chunks], show_progress_bar=False).tolist(),
            metadatas=[{"chunk_index": c["chunk_index"]} for c in chunks],
            ids=[f"chunk_{c['chunk_index']}" for c in chunks]
        )
        return len(chunks)

    def query(self, lecture_id: str, query: str, top_k: int = 3):
        col = self.client.get_collection(name=f"lecture_{lecture_id}")
        q_emb = self.embedding_model.encode([query], show_progress_bar=False).tolist()
        res = col.query(query_embeddings=q_emb, n_results=top_k)
        docs = res.get("documents", [[]])[0]
        return docs

vectordb_service = VectorDBService()