# 📁 Source Tree Map

This document lists the structure of the project files.

```text
movie-rec-engine/
├── backend/                    # Python FastAPI & ML Recommender
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # API routing & setup
│   │   ├── recommender.py     # Recommender algorithm core
│   │   └── data_loader.py     # Data reading and preprocess
│   ├── data/
│   │   └── movies.csv         # Curated CSV dataset of movies
│   ├── requirements.txt       # Python library dependencies
│   └── run.py                 # Convenience script to run backend
├── frontend/                   # UI Application
│   ├── index.html             # UI Shell
│   ├── src/
│   │   ├── main.js            # App logic & routing
│   │   └── styles.css         # Styling system
│   ├── package.json           # npm configuration
│   └── vite.config.js         # Vite dev configuration
└── docs/                       # Educational & technical guides
    ├── README.md               # Documentation entry point
    ├── concepts/               # ML & NLP explanation guides
    │   ├── 01-nlp-basics.md
    │   ├── 02-similarity.md
    │   └── 03-recommendation.md
    ├── architecture/           # Technical drawings & layout
    │   ├── overview.md
    │   └── source-tree.md
    └── epics/                  # Implementation plans per feature
        ├── epic-1-backend-ml.md
        ├── epic-2-api-service.md
        └── epic-3-ui-shell.md
```
