# 🗄️ Kaggle Dataset Schema & Command Reference

This document maps the files inside the Kaggle **"The Movies Dataset"** and lists the useful Python3/terminal commands to clean, verify, and run the engine.

---

## 📊 1. Kaggle Dataset File Schema & Future Enhancements

The full Kaggle download contains **7 CSV files**. Here is what they represent and how you can leverage them to build out planned Epics:

| File Name | Description | Key Columns | Row Count | Future Enhancements (Next Epics) |
|---|---|---|---|---|
| **`movies_metadata.csv`** | Core movie profiles, budgets, genres, and overviews. | `id`, `title`, `genres`, `tagline`, `overview`, `vote_count` | 45,466 | **Epic 7 (Completed)**: Ingested to form the content-based recommendation model library. |
| **`ratings_small.csv`** | A small subset of user ratings (100k) from 700 users. | `userId`, `movieId`, `rating`, `timestamp` | 100,004 | **Epic 4 (Planned)**: Perfect size to train local collaborative SVD models quickly. |
| **`ratings.csv`** | Full interaction ratings dataset. | `userId`, `movieId`, `rating`, `timestamp` | 26,024,289 | **Scale Optimization**: Move SVD training to cloud databases (BigQuery/Postgres) if using the full 26M dataset. |
| **`credits.csv`** | Cast and crew names for all movies. | `cast` (JSON list), `crew` (JSON list), `id` | 45,476 | **Content Expansion**: Parse actors/directors to recommend movies by the same director or starring the same cast. |
| **`keywords.csv`** | Plot keywords describing movies. | `id`, `keywords` (JSON list of tags) | 46,219 | **Content Expansion**: Append plot keywords (e.g. "time travel", "dystopian") to `nlp_features` for better TF-IDF accuracy. |
| **`links.csv`** | ID mapping files to link movies to external databases. | `movieId`, `imdbId`, `tmdbId` | 45,843 | **Metadata Linking**: Fetch poster images or live reviews dynamically using external API services. |

---

## 🛠️ 2. Python 3 & Pip 3 Versioning Conventions

### Why explicitly use `python3` and `pip3` instead of `python` and `pip`?

On macOS and Unix environments, there is a distinct difference in executable paths.

| Tool | Pro | Con |
|---|---|---|
| **`python3` / `pip3`** | **Explicit Environment Resolution**: Avoids linking to outdated Python 2.x system runtimes.<br>**Consistency**: Modern macOS systems do not symlink `python` by default, so typing `python3` prevents "command not found" errors. | **Keystroke Overhead**: Requires typing an extra `3` character. |
| **`python` / `pip`** | **Shorter Command**: Slightly faster to type in the terminal.<br>**Windows Default**: On Windows systems, Python installs as `python.exe` and `python3` commands are often unrecognized. | **Environment Ambiguity**: On macOS, typing `python` might invoke a legacy Python 2 interpreter (installed for OS support) instead of your Python 3 environment. |

*   **Conclusion**: For development on **macOS**, always run explicitly with `python3` and `pip3` to ensure standard packages are installed into your Python 3 environment.

---

## 💻 3. Essential CLI Commands Reference

Here are all the commands used to set up, clean, and test the scale-optimized engine:

### A. Ingestion & Preprocessing
To clean the raw `movies_metadata.csv` and filter it to the top ~5,000 popular movies:
```bash
python3 backend/app/ingest_kaggle.py
```

### B. Dependencies Installation
Install backend python libraries:
```bash
pip3 install -r backend/requirements.txt
```
Install frontend node packages:
```bash
cd frontend && npm install
```

### C. Python Instantiation Test
Verify that the `MovieRecommender` class initializes, loads the cleaned dataset, and generates sparse matrices:
```bash
python3 -c "import sys; sys.path.append('backend'); from app.recommender import MovieRecommender; r = MovieRecommender(); print(r.df.head(2))"
```

### D. Live Recommendation Algorithm Test
Test the dynamic cosine similarity matching speed and result quality (using ID `862` for *Toy Story*):
```bash
python3 -c "import sys; sys.path.append('backend'); from app.recommender import MovieRecommender; r = MovieRecommender(); print(r.get_recommendations(862, limit=2))"
```

### E. Run Dev Servers
To run the full stack locally:
*   **FastAPI API Server**:
    ```bash
    python3 backend/run.py
    ```
*   **Vite Frontend Dev Server**:
    ```bash
    cd frontend
    npm run dev
    ```
