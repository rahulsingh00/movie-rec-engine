# Epic 5: Sentence-Transformers Semantic Search

Integrate pre-trained Transformer embeddings to power semantic text search in movie overviews.

## Acceptance Criteria

- [ ] Incorporate Python's `sentence-transformers` library in backend dependencies.
- [ ] Embed the movie overviews using a lightweight pre-trained model (e.g., `all-MiniLM-L6-v2`) on startup or data load.
- [ ] Implement a semantic search endpoint `GET /api/search/semantic?query={query}` that converts search queries into embeddings and computes cosine similarities.
- [ ] Allow the search interface on the frontend to toggle between "Keyword Match" and "Semantic Search".
- [ ] Demonstrate semantic parsing (e.g. searching "funny robotic space adventure" matches *WALL-E*).

---

## 📐 Conceptual Guide & Background

Unlike TF-IDF which searches for exact word matches, Sentence-Transformers map entire sentences into a shared vector space where semantic proximity is represented by distance. This maps meaning, synonyms, and context.

### Learn More
*   [Sentence-Transformers Official Site](https://www.sbert.net/)
*   [Hugging Face Models Directory](https://huggingface.co/models)
