# Epic 10: Serverless Production Deployment & Cloud Scale

Containerize the recommendation service and deploy it to a serverless cloud environment to make the platform accessible to a global audience.

## Status: ⚪ Planned
## Priority: P3

---

## 📋 Acceptance Criteria

- [ ] Write a production-ready `Dockerfile` for the FastAPI backend, utilizing multi-stage builds to optimize image layers.
- [ ] Configure volume mounts or download scripting to cache the Hugging Face Sentence-Transformer models, avoiding repeated cold-start downloads.
- [ ] Implement configurations to deploy the static frontend application (e.g. Firebase App Hosting, Vercel, or Netlify).
- [ ] Migrate the local SQLite database setup to a serverless relational database instance (e.g. Supabase, PostgreSQL on Cloud SQL, or Neon DB).
- [ ] Verify deployment accessibility, checking that API response times and frontend routing load correctly.

---

## 📐 Conceptual Guide & Further Reading
*   **Dockerizing FastAPI Applications**: [FastAPI in Docker (Official Documentation)](https://fastapi.tiangolo.com/deployment/docker/)
*   **Firebase App Hosting**: [Deploy Web Apps with App Hosting](https://firebase.google.com/docs/app-hosting)
*   **Serverless SQL Databases**: [Supabase PostgreSQL Intro](https://supabase.com/docs/guides/database/overview)
