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
| 4 | [Collaborative Filtering Hybrid Sandbox](epics/epic-4-collaborative.md) | ✅ Completed | P1 |
| 5 | [Sentence-Transformers Semantic Search](epics/epic-5-semantic-search.md) | ✅ Completed | P1 |
| 6 | [Evaluation Dashboard & Metrics](epics/epic-6-evaluation.md) | ✅ Completed | P2 |
| 7 | [Kaggle Movie Dataset Integration & Scale Optimization](epics/epic-7-kaggle-integration.md) | ✅ Completed | P1 |
| 8 | [Vector Database Migration (FAISS / Qdrant / Chroma)](epics/epic-8-vector-db.md) | ⚪ Planned | P2 |
| 9 | [Real-time User Activity Logging & Implicit Feedback](epics/epic-9-implicit-feedback.md) | ⚪ Planned | P2 |
| 10 | [Serverless Production Deployment & Cloud Scale](epics/epic-10-cloud-deployment.md) | ⚪ Planned | P3 |

---

## 🛠️ Installation & Setup

Before running the application, you must install dependencies for both the backend (Python 3) and the frontend (Node.js).

### 1. Backend Dependencies Installation
Open your terminal and run:
```bash
pip3 install -r backend/requirements.txt
```
*Note: This will install FastAPI, Uvicorn, Pandas, and Scikit-learn required by the recommendation engine.*

> [!TIP]
> **Python 3 & Pip 3 Environment Conventions**: Always run commands using explicit version paths (`python3` and `pip3` instead of `python` and `pip`) on macOS. This avoids resolving to legacy system Python 2.x runtimes.
>
> | Tool Command | Pros | Cons |
> |---|---|---|
> | **`python3` / `pip3`** | Explicit environment resolution; prevents "interpreter not found" on macOS systems. | Minor typing overhead. |
> | **`python` / `pip`** | Slightly faster to type. | High risk of resolving to legacy system interpreters. |

### 2. Frontend Dependencies Installation
Navigate to the `frontend/` folder and run `npm install` to setup Vite:
```bash
cd frontend
npm install
```

---

## 🚀 Running the Project

To experience and test the completed implementation:

### 1. Run the Backend API
Run the FastAPI development server:
```bash
python3 backend/run.py
```
The backend will start on `http://127.0.0.1:8000`. You can access interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

### 2. Run the Frontend App
Start the Vite dev server:
```bash
cd frontend
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
