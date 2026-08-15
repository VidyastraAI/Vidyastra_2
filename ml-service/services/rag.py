import logging
from pathlib import Path
from typing import List, Dict, Any
import chromadb
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from config import settings
from utils.chunk import chunk_text

logger = logging.getLogger(__name__)

class RAGService:
    """Service to handle vector database indexing, semantic retrieval, and local LLM generation."""

    def __init__(self):
        logger.info("Initializing RAG service components...")
        
        # Initialize embedding model
        self.embedding_model_name = settings.EMBEDDING_MODEL_NAME
        logger.info(f"Loading embedding model: {self.embedding_model_name}")
        self.embedding_model = SentenceTransformer(self.embedding_model_name)

        # Initialize ChromaDB persistent client
        self.chroma_client = chromadb.PersistentClient(path=str(settings.CHROMA_DIR))

        # Initialize local LLM (Qwen2.5-3B-Instruct quantized/standard CPU pipeline)
        self.llm_model_name = settings.LLM_MODEL_NAME
        logger.info(f"Loading LLM pipeline for: {self.llm_model_name} (Running on CPU)...")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.llm_model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.llm_model_name,
                torch_dtype=torch.float32,
                device_map="auto"
            )
            self.generator = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                max_new_tokens=512,
                temperature=0.3,
                do_sample=True
            )
        except Exception as e:
            logger.warning(f"Could not load LLM model locally ({e}). Fallback generation mode enabled.")
            self.generator = None

    def index_lecture(self, fused_text: str, lecture_id: str) -> int:
        """
        Chunks fused text, generates embeddings, and indexes them into ChromaDB.

        Args:
            fused_text (str): Master multimodal text from the fusion service.
            lecture_id (str): Unique lecture identifier.

        Returns:
            int: Total number of chunks indexed.
        """
        logger.info(f"Indexing lecture {lecture_id} into vector store...")
        
        chunks = chunk_text(fused_text, chunk_size=settings.CHUNK_SIZE, chunk_overlap=settings.CHUNK_OVERLAP)
        if not chunks:
            logger.warning(f"No chunks generated for lecture {lecture_id}.")
            return 0

        collection_name = f"lecture_{lecture_id}"
        # Get or create collection
        collection = self.chroma_client.get_or_create_collection(name=collection_name)

        documents = [c["text"] for c in chunks]
        metadatas = [{"chunk_index": c["chunk_index"], "word_count": c["word_count"]} for c in chunks]
        ids = [f"chunk_{c['chunk_index']}" for c in chunks]

        # Generate embeddings
        embeddings = self.embedding_model.encode(documents, show_progress_bar=False).tolist()

        # Upsert into ChromaDB
        collection.upsert(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

        logger.info(f"Successfully indexed {len(chunks)} chunks for lecture {lecture_id}.")
        return len(chunks)

    def query_lecture(self, lecture_id: str, query: str, top_k: int = 3) -> Dict[str, Any]:
        """
        Performs a semantic similarity search and generates an answer using the local LLM.

        Args:
            lecture_id (str): Unique lecture identifier.
            query (str): User question.
            top_k (int): Number of relevant chunks to retrieve.

        Returns:
            Dict[str, Any]: Answer, retrieved context chunks, and metadata.
        """
        logger.info(f"Processing query for lecture {lecture_id}: '{query}'")
        
        collection_name = f"lecture_{lecture_id}"
        try:
            collection = self.chroma_client.get_collection(name=collection_name)
        except Exception as e:
            logger.error(f"Collection {collection_name} not found: {e}")
            raise RuntimeError(f"Lecture {lecture_id} vector index not found. Please process the video first.")

        # Embed query
        query_embedding = self.embedding_model.encode([query], show_progress_bar=False).tolist()

        # Query ChromaDB
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=top_k
        )

        retrieved_documents = results.get("documents", [[]])[0]
        retrieved_metadatas = results.get("metadatas", [[]])[0]

        context = "\n\n".join(retrieved_documents)

        # Construct Prompt
        prompt = f"""You are an AI teaching assistant. Answer the user's question accurately using ONLY the provided lecture context below. If the answer cannot be found in the context, state that you don't know based on the lecture.

Lecture Context:
{context}

Question: {query}
Answer:"""

        answer = ""
        if self.generator:
            try:
                output = self.generator(prompt)
                generated_text = output[0]["generated_text"]
                # Extract text after "Answer:"
                if "Answer:" in generated_text:
                    answer = generated_text.split("Answer:")[-1].strip()
                else:
                    answer = generated_text.strip()
            except Exception as e:
                logger.error(f"LLM generation failed: {e}")
                answer = f"Error generating answer with local LLM: {e}"
        else:
            answer = f"LLM model unavailable. Retrieved context fragments:\n{context}"

        return {
            "query": query,
            "answer": answer,
            "retrieved_chunks": retrieved_documents,
            "metadatas": retrieved_metadatas
        }

# Singleton instance
rag_service = RAGService()