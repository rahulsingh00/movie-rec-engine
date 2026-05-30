# Epic 5: Sentence-Transformers Semantic Search

Integrate pre-trained Transformer embeddings to power semantic text search in movie overviews.

## Acceptance Criteria

- [x] Incorporate Python's `sentence-transformers` library in backend dependencies.
- [x] Set up a lightweight local vector store (NumPy-based exact Cosine Similarity index) to cache and search text embeddings.
- [x] Generate dense embeddings of the movie overviews using a lightweight pre-trained model (`all-MiniLM-L6-v2`) on startup/pre-computational run and write them to the vector store.
- [x] Implement a semantic search endpoint `GET /api/search/semantic?query={query}` that embeds the search query and queries the vector store for top-K matches.
- [x] Allow the search interface on the frontend to toggle between "Keyword Match" and "Semantic Search".
- [x] Demonstrate semantic parsing (e.g. searching "funny robotic space adventure" matches *WALL-E*).

---

## 🛠️ Implementation Details

For our sandboxed dataset of 4,733 movies, we designed and implemented a custom NumPy-based `VectorStore` in [vector_store.py](file:///Users/rahulsingh/Work/movie-rec-engine/backend/app/vector_store.py).
- **Why NumPy instead of ChromaDB/FAISS?** A flat NumPy array (`float32`, [N x D]) with vectorized exact cosine similarity via `np.dot` is extremely fast for under 10k items, consumes negligible memory, and avoids heavy compiled native dependencies on macOS Apple Silicon.
- **Model**: `all-MiniLM-L6-v2` (384 dimensions).
- **Pre-computation**: Done via [embed_movies.py](file:///Users/rahulsingh/Work/movie-rec-engine/backend/app/embed_movies.py), caching the embeddings to `backend/data/movie_embeddings.npy` and `movie_ids.json`.
- **API**: Exposed via `/api/search/semantic`.

---

## 📐 Conceptual Guide & Background

### Why a Local Vector Store (ChromaDB / FAISS)?
Computing cosine similarities on high-dimensional vectors (like 384-dimension BERT outputs) for large datasets on every search query is CPU-intensive. Incorporating **ChromaDB** or **FAISS** abstracts vector distance math away, acting as a database specialized for vector calculations. It speeds up retrieval times and demonstrates how production-scale semantic searches operate.


Unlike TF-IDF which searches for exact word matches, Sentence-Transformers map entire sentences into a shared vector space where semantic proximity is represented by distance. This maps meaning, synonyms, and context.

### Learn More
*   [Sentence-Transformers Official Site](https://www.sbert.net/)
*   [Hugging Face Models Directory](https://huggingface.co/models)
