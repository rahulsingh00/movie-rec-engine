# Epic 5: Sentence-Transformers Semantic Search

Integrate pre-trained Transformer embeddings to power semantic text search in movie overviews.

## Acceptance Criteria

- [ ] Incorporate Python's `sentence-transformers` library in backend dependencies.
- [ ] Set up a lightweight local vector store (e.g., **ChromaDB** or **FAISS**) to cache and search text embeddings.
- [ ] Generate dense embeddings of the movie overviews using a lightweight pre-trained model (e.g., `all-MiniLM-L6-v2`) on startup and write them to the vector store.
- [ ] Implement a semantic search endpoint `GET /api/search/semantic?query={query}` that embeds the search query and queries the vector store for top-K matches.
- [ ] Allow the search interface on the frontend to toggle between "Keyword Match" and "Semantic Search".
- [ ] Demonstrate semantic parsing (e.g. searching "funny robotic space adventure" matches *WALL-E*).

---

## 📐 Conceptual Guide & Background

### Why a Local Vector Store (ChromaDB / FAISS)?
Computing cosine similarities on high-dimensional vectors (like 384-dimension BERT outputs) for large datasets on every search query is CPU-intensive. Incorporating **ChromaDB** or **FAISS** abstracts vector distance math away, acting as a database specialized for vector calculations. It speeds up retrieval times and demonstrates how production-scale semantic searches operate.


Unlike TF-IDF which searches for exact word matches, Sentence-Transformers map entire sentences into a shared vector space where semantic proximity is represented by distance. This maps meaning, synonyms, and context.

### Learn More
*   [Sentence-Transformers Official Site](https://www.sbert.net/)
*   [Hugging Face Models Directory](https://huggingface.co/models)
