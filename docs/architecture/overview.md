# 🏛️ System Architecture — Movie Recommendation Engine

## Overview

The Movie Recommendation Engine is built as a **hybrid Python-JavaScript application** consisting of a Fast and modern REST API backend and a responsive client-side SPA frontend.

```mermaid
graph TD
    subgraph "Frontend Layer (Vite + Vanilla JS)"
        UI["UI Interface (HTML/CSS)"]
        State["App State Controller"]
        APIClient["API Client (Fetch)"]
    end

    subgraph "Backend Layer (FastAPI + Python)"
        API["FastAPI App (main.py)"]
        Engine["Recommender Engine"]
        Dataset["Data Loader (Pandas)"]
        Scikit["Scikit-Learn (TF-IDF & Cosine Similarity)"]
    end

    UI --> State
    State --> APIClient
    APIClient -- HTTP requests --> API
    API --> Engine
    Engine --> Dataset
    Engine --> Scikit
```

## Module Responsibilities

### 1. Backend Layer (Python)
- **FastAPI Interface**: Exposes endpoints (`/movies`, `/recommend`, `/search`) and returns JSON payloads.
- **Recommender Engine**: Performs TF-IDF Vectorization, builds the similarity matrix, and queries top-K recommendations.
- **Dataset Loader**: Reads a CSV file containing movie titles, overviews, taglines, and genres, doing basic cleaning on load.

### 2. Frontend Layer (JS)
- **UI Shell**: Interactive user interface featuring search inputs, interactive similarity matrices, genre filters, and movie details cards.
- **App State Controller**: Manages current selected movie, search query, genre filters, and active recommendations.
- **API Client**: Handles fetches, error handling, and loading animations.

## Data Flow for Recommendation Query

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant FastAPI
    participant Recommender
    
    User->>Frontend: Selects "Inception"
    Frontend->>FastAPI: GET /recommend?title=Inception&limit=5
    FastAPI->>Recommender: get_recommendations("Inception", limit=5)
    Note over Recommender: Lookup Index of "Inception"<br/>Fetch row from precomputed Similarity Matrix<br/>Sort indices by score descending<br/>Select Top-5 indices (excluding self)
    Recommender->>FastAPI: Return movie records + similarity scores
    FastAPI->>Frontend: Return JSON data
    Frontend->>User: Render recommended cards with similarity match percentage
```
