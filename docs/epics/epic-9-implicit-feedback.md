# Epic 9: Real-time User Activity Logging & Implicit Feedback

Capture implicit user signals (clicks, selection history) to build real-time recommendation profiles without relying solely on explicit star ratings.

## Status: ⚪ Planned
## Priority: P2

---

## 📋 Acceptance Criteria

- [ ] Create a `user_activity` schema in the SQLite database to log implicit interactions (user clicks on recommended movies, searches, hover time).
- [ ] Expose an API endpoint `POST /api/activity` to register frontend client interaction telemetry.
- [ ] Implement a frontend event handler in `main.js` that triggers telemetry logs when users click movie items or recommendation grid cards.
- [ ] Design an implicit feedback ranker that converts click patterns into surrogate rating scores (e.g. converting clicks into scores between `[0.0, 1.0]`).
- [ ] Integrate these implicit scores into the collaborative recommender database to augment rating inputs.

---

## 📐 Conceptual Guide & Further Reading
*   **Implicit vs Explicit Feedback**: [Understanding Feedback in Recommender Systems (Medium)](https://towardsdatascience.com/implicit-vs-explicit-feedback-in-recommender-systems-7e615e4f20ec)
*   **User Telemetry Logging**: [Capturing Clickstream Data (Analytics Vidhya)](https://www.analyticsvidhya.com/blog/2021/04/clickstream-data-analysis-web-analytics/)
