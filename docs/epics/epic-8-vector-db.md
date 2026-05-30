# Epic 8: Vector Database Migration (FAISS / Qdrant / Chroma)

Migrate the in-memory NumPy vector storage and exact search index to a specialized, production-ready Vector Database.

## Status: ⚪ Planned
## Priority: P2

---

## 📋 Acceptance Criteria

- [ ] Run a local instance of Qdrant or ChromaDB (e.g. via a Docker container or SQLite-based local client).
- [ ] Implement a `VectorStoreAdapter` interface that abstracts the vector backend operations (initializing collection, index insertion, similarity search).
- [ ] Write a CLI ingestion task that populates the vector database collection with precomputed 384-dimension `all-MiniLM-L6-v2` plot embeddings.
- [ ] Refactor `GET /api/search/semantic` endpoint to fetch matching collections scores using the database client SDK rather than NumPy flat arrays operations.
- [ ] Verify that query results remain accurate and request latencies do not exceed 50ms.

---

## 📐 Conceptual Guide & Further Reading
*   **Vector Databases Overview**: [What is a Vector Database? (Pinecone)](https://www.pinecone.io/learn/vector-database/)
*   **Qdrant Documentation**: [Qdrant Quick Start Guide](https://qdrant.tech/documentation/quick-start/)
*   **ChromaDB Documentation**: [ChromaDB Introduction](https://docs.trychroma.com/)
