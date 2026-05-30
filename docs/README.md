# 📚 Movie Recommendation Engine — Documentation Index

> Living documentation for the educational Movie Recommendation Engine project, detailing ML and NLP concepts alongside technical specifications.

## 📐 Architecture & Reference

| Document | Description |
|----------|-------------|
| [System Overview](architecture/overview.md) | High-level architecture, Python/JS hybrid design, and data flows |
| [Google Data Cloud Integration](architecture/google-data-cloud-integration.md) | Architecture strategy for scaling database, model training, and explaining recommendations |
| [Source Tree](architecture/source-tree.md) | Annotated file structure map of the project |

## 🧠 ML & NLP Core Concepts

| Concept | Description |
|---------|-------------|
| [NLP Basics](concepts/01-nlp-basics.md) | Tokenization, text cleaning, stop words, TF-IDF Vectorization |
| [Cosine Similarity](concepts/02-similarity.md) | Vector spaces and calculating metric distances |
| [Recommendation Paradigms](concepts/03-recommendation.md) | Content-based filtering vs Collaborative filtering |
| [Advanced Concepts](concepts/04-advanced-concepts.md) | Vector DBs, GNNs, Deep Learning Recommenders, and future projects |
| [Kaggle Schema & Commands](concepts/05-kaggle-dataset-schema.md) | Maps the 7 raw CSVs, potential enhancements, and useful CLI scripts |

## 📋 Epics (Backlog & Milestones)

| # | Epic | Status | Priority |
|---|------|--------|----------|
| 1 | [Backend ML & NLP Model](epics/epic-1-backend-ml.md) | ✅ Completed | P0 |
| 2 | [FastAPI REST Service](epics/epic-2-api-service.md) | ✅ Completed | P0 |
| 3 | [Responsive Web UI](epics/epic-3-ui-shell.md) | ✅ Completed | P0 |
| 4 | [Collaborative Filtering Hybrid Sandbox](epics/epic-4-collaborative.md) | ⚪ Planned | P1 |
| 5 | [Sentence-Transformers Semantic Search](epics/epic-5-semantic-search.md) | ⚪ Planned | P1 |
| 6 | [Evaluation Dashboard & Metrics](epics/epic-6-evaluation.md) | ⚪ Planned | P2 |
| 7 | [Kaggle Movie Dataset Integration & Scale Optimization](epics/epic-7-kaggle-integration.md) | ⚪ Planned | P1 |

---

## 🚀 Running the Project

To experience and test the completed implementation:

### 1. Run the Backend API
1. Install Python dependencies:
   ```bash
   pip3 install -r backend/requirements.txt
   ```
2. Run the FastAPI development server:
   ```bash
   python3 backend/run.py
   ```
   The backend will start on `http://127.0.0.1:8000`. You can access interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

### 2. Run the Frontend App
1. Navigate to the `frontend/` directory and install npm packages:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open the displayed localhost URL (usually `http://localhost:5173`) in your browser to interact with the movie recommender!

---

## 🎓 Recommended Learning Order

For self-paced study, read through the documentation in the following sequence:
1. **[NLP Basics](concepts/01-nlp-basics.md)** — Understand tokenization and how TF-IDF vectorizes unstructured text.
2. **[Cosine Similarity](concepts/02-similarity.md)** — Explore the geometric vector space math used to compute similarities.
3. **[Recommendation Paradigms](concepts/03-recommendation.md)** — Put it all together and compare content-based approaches with collaborative filtering.
4. **[System Overview](architecture/overview.md)** — Dive into how the FastAPI backend integrates with the Vite-based SPA frontend.
5. **[Advanced Concepts](concepts/04-advanced-concepts.md)** — Discover industrial systems: Vector Databases, Transformers/BERT embeddings, and GNNs.
6. **[Kaggle Schema & Commands](concepts/05-kaggle-dataset-schema.md)** — Reference sheet for running the model and understanding Kaggle's files.
