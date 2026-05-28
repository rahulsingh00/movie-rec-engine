# Epic 1: Backend ML & NLP Model

Implement the core NLP and recommendation algorithms in Python using `scikit-learn` and `pandas`.

## Acceptance Criteria

- [ ] Load and clean a movie dataset (CSV format) including overviews, genres, taglines, and titles.
- [ ] Implement text preprocessing (handling missing values, lowercasing, and basic cleaning).
- [ ] Build a TF-IDF vectorizer to extract term frequencies and document frequencies.
- [ ] Calculate the Cosine Similarity matrix for the entire dataset.
- [ ] Expose an internal API/method `get_recommendations(movie_title, limit)` that retrieves the top $N$ closest movies based on cosine similarity scores.
- [ ] Provide fallback logic if a requested movie is not found.
