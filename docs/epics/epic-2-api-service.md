# Epic 2: FastAPI REST Service

Expose the recommender engine through REST APIs using FastAPI, allowing the frontend to make dynamic queries.

## Status: ✅ Completed

## Acceptance Criteria

- [x] Set up a FastAPI server running on `uvicorn`.
- [x] Implement `GET /api/movies` to return a list of all movies in the dataset (with pagination/search filtering).
- [x] Implement `GET /api/recommend/{movie_id}` which accepts a movie ID and return the top recommended matches with similarity scores.
- [x] Implement CORS middleware to allow connections from a separate frontend domain/port.
- [x] Automatically document endpoints via Swagger (`/docs` page).

---

## 🔍 Technical Deep Dive & Implementation

The API service is built using **FastAPI**, an asynchronous, high-performance web framework for building APIs in Python.

### 1. Endpoint Architecture
*   **Root Route (`GET /`)**: Health check route to ensure the backend is responsive.
*   **Movies Catalog (`GET /api/movies?query={query}`)**: Searches and retrieves movies from the processed Pandas dataset.
*   **Similarity Recommendations (`GET /api/recommend/{movie_id}?limit={limit}`)**: Retrieves the top similar movies from the recommender engine, sorting them in descending order of similarity score.

### 2. CORS Middleware
Web browsers restrict scripts from initiating HTTP requests to a different domain/port. We import `CORSMiddleware` and configure it to enable browser-based queries from our Vite frontend server (which runs on a separate port: `5173`):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow requests from any local origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Interactive Documentation
FastAPI inspects Python type hints to generate an OpenAPI standard specification. It automatically hosts:
*   Interactive Swagger UI at `/docs`
*   Alternative ReDoc documentation at `/redoc`

---

## 📚 Further Reading & Learning Resources

*   **FastAPI Documentation**: [FastAPI Official Docs](https://fastapi.tiangolo.com/)
*   **Asynchronous ASGI Servers**: [Uvicorn Official Guide](https://www.uvicorn.org/)
*   **Cross-Origin Resource Sharing**: [MDN Web Docs on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
*   **Swagger/OpenAPI Spec**: [OpenAPI Specification (Official Website)](https://www.openapis.org/)

