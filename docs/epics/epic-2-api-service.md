# Epic 2: FastAPI REST Service

Expose the recommender engine through REST APIs using FastAPI, allowing the frontend to make dynamic queries.

## Acceptance Criteria

- [ ] Set up a FastAPI server running on `uvicorn`.
- [ ] Implement `GET /api/movies` to return a list of all movies in the dataset (with pagination/search filtering).
- [ ] Implement `GET /api/recommend` which accepts a movie ID/title and return the top recommended matches with similarity scores.
- [ ] Implement CORS middleware to allow connections from a separate frontend domain/port.
- [ ] Automatically document endpoints via Swagger (`/docs` page).
