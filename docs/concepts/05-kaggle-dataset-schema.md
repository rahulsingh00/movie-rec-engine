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

## 🛠️ 2. Data Cleaning & Integration Commands

To ingest, verify, and seed the Kaggle dataset files into the recommender pipeline locally, run the following ingestion scripts:

### A. Movie Metadata Preprocessing
Filters raw `movies_metadata.csv` to popular titles and parses categories structure:
```bash
python3 backend/app/ingest_kaggle.py
```

### B. User Ratings Database Seeding
Extracts validation ratings from `ratings_small.csv` and populates the SQLite transactions model:
```bash
python3 backend/app/seed_db.py
```
