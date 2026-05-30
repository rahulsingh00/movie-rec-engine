import numpy as np
import pandas as pd
import random
from sqlalchemy.orm import Session
from app.models import Rating
from app.collaborative import SVDReranker
from sklearn.metrics.pairwise import cosine_similarity

def evaluate_models(db: Session, k_values=[1, 3, 5, 10]):
    # 1. Fetch ratings from DB
    ratings = db.query(Rating).all()
    if not ratings:
        return {"error": "No ratings in database to evaluate."}

    # Set seed for reproducibility
    random.seed(42)
    np.random.seed(42)

    # 2. Shuffle and split 80/20 train/test
    shuffled_ratings = list(ratings)
    random.shuffle(shuffled_ratings)
    split_idx = int(len(shuffled_ratings) * 0.8)
    train_ratings = shuffled_ratings[:split_idx]
    test_ratings = shuffled_ratings[split_idx:]

    # 3. Fit SVD model on training ratings only
    svd_model = SVDReranker(db, k=15, ratings_list=train_ratings)

    # 4. Set up content recommender helper
    from app.recommender import MovieRecommender
    recommender = MovieRecommender()
    tfidf_matrix = recommender.tfidf_matrix
    df = recommender.df

    # Create mapping from movie_id to index in dataframe
    movie_id_to_idx = {int(row["id"]): idx for idx, row in df.iterrows()}
    
    # 5. Group training and test ratings by user
    train_by_user = {}
    for r in train_ratings:
        train_by_user.setdefault(r.user_id, []).append((r.movie_id, r.rating))

    test_by_user = {}
    for r in test_ratings:
        test_by_user.setdefault(r.user_id, []).append((r.movie_id, r.rating))

    # We evaluate for users who have at least one highly rated movie (>= 3.5) and one poorly rated movie (< 3.5)
    # in the test set to ensure there is a ranking task, and who have training history.
    eval_users = []
    for user_id, user_ratings in test_by_user.items():
        relevant_movies = set(mid for mid, rating in user_ratings if rating >= 3.5)
        all_test_movies = [mid for mid, _ in user_ratings]
        if relevant_movies and len(relevant_movies) < len(all_test_movies) and user_id in train_by_user:
            eval_users.append((user_id, relevant_movies, all_test_movies))

    # If we don't have enough users matching the strict condition, loosen it to any user with relevant movies
    if len(eval_users) < 10:
        eval_users = []
        for user_id, user_ratings in test_by_user.items():
            relevant_movies = set(mid for mid, rating in user_ratings if rating >= 3.5)
            all_test_movies = [mid for mid, _ in user_ratings]
            if relevant_movies and user_id in train_by_user:
                eval_users.append((user_id, relevant_movies, all_test_movies))

    if not eval_users:
        return {"error": "Insufficient test data for evaluation."}

    # Initialize metric accumulators
    models = ["content", "svd", "hybrid"]
    metrics = {
        model: {
            "precision": {k: [] for k in k_values},
            "recall": {k: [] for k in k_values},
            "map": []
        }
        for model in models
    }

    # 6. Evaluation Loop
    for user_id, relevant_movies, test_movies in eval_users:
        # User profile vector for content recommendations: average TF-IDF vectors of highly rated training movies
        high_rated_train_idxs = [
            movie_id_to_idx[mid] 
            for mid, rating in train_by_user[user_id] 
            if rating >= 3.5 and mid in movie_id_to_idx
        ]

        if high_rated_train_idxs:
            user_profile_vec = np.asarray(tfidf_matrix[high_rated_train_idxs].mean(axis=0))
            # Compute similarity against all test movies
            test_movie_idxs = [movie_id_to_idx[mid] if mid in movie_id_to_idx else None for mid in test_movies]
            content_scores = []
            for mid in test_movies:
                if mid in movie_id_to_idx:
                    idx = movie_id_to_idx[mid]
                    score = float(cosine_similarity(user_profile_vec, tfidf_matrix[idx])[0][0])
                else:
                    score = 0.0
                content_scores.append(score)
        else:
            content_scores = [0.0] * len(test_movies)

        content_scores = np.array(content_scores)

        # Predict SVD ratings and hybrid scores for test movies
        svd_scores = []
        hybrid_scores = []
        for i, mid in enumerate(test_movies):
            pred_rating = svd_model.predict_rating(user_id, mid)
            normalized_rating = pred_rating / 5.0
            c_score = float(content_scores[i])
            h_score = (0.5 * c_score) + (0.5 * normalized_rating)
            
            svd_scores.append(pred_rating)
            hybrid_scores.append(h_score)

        svd_scores = np.array(svd_scores)
        hybrid_scores = np.array(hybrid_scores)

        # Evaluate ranking for each model
        for model_name in models:
            if model_name == "content":
                scores = content_scores
            elif model_name == "svd":
                scores = svd_scores
            else:
                scores = hybrid_scores

            # Sort test movies by score descending
            sorted_indices = np.argsort(scores)[::-1]
            ranked_test_movies = [test_movies[idx] for idx in sorted_indices]

            # Compute Precision@K and Recall@K
            for k in k_values:
                # If the user has fewer than K test movies, we take all of them
                k_val = min(k, len(ranked_test_movies))
                rec_at_k = ranked_test_movies[:k_val]
                hits = sum(1 for mid in rec_at_k if mid in relevant_movies)
                
                precision = hits / k_val if k_val > 0 else 0.0
                recall = hits / len(relevant_movies) if len(relevant_movies) > 0 else 0.0
                
                metrics[model_name]["precision"][k].append(precision)
                metrics[model_name]["recall"][k].append(recall)

            # Compute Average Precision (AP)
            ap_sum = 0.0
            hits_found = 0
            for i, mid in enumerate(ranked_test_movies):
                if mid in relevant_movies:
                    hits_found += 1
                    ap_sum += hits_found / (i + 1)
            
            ap = ap_sum / len(relevant_movies) if len(relevant_movies) > 0 else 0.0
            metrics[model_name]["map"].append(ap)

    # 7. Aggregate results
    results = {}
    for model_name in models:
        results[model_name] = {
            "map": float(np.mean(metrics[model_name]["map"])),
            "precision": {k: float(np.mean(metrics[model_name]["precision"][k])) for k in k_values},
            "recall": {k: float(np.mean(metrics[model_name]["recall"][k])) for k in k_values}
        }

    return {
        "num_eval_users": len(eval_users),
        "metrics": results,
        "k_values": k_values
    }
