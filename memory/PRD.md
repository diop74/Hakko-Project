# PRD — HAAKO

## Original Problem Statement
Plateforme web full-stack pour HAAKO, une application d'intelligence stratégique et de recherche dédiée à l'accès à l'énergie, au climat et au développement durable en Afrique (Mauritanie en particulier).

## Stack
- Frontend : React 19, TailwindCSS, Framer Motion, MDEditor, html2pdf.js
- Backend : FastAPI, MongoDB (Motor), Emergent Object Storage
- Auth : Emergent-managed Google Auth (restreint à 3 emails via `.env`)
- Design : "Swiss-Eco" institutionnel, vert profond #1B5E20

## User Personas
- **Visiteur public** : Lit les articles, About, Solutions, Contact (sans authentification).
- **Admin** : Crée/édite articles, voit dashboard et messages contact (3 emails autorisés uniquement).

## Core Requirements
- Pages publiques : Accueil, À propos, Solutions, Blog, Contact.
- Dashboard admin sécurisé (CMS articles + pages).
- Téléchargement PDF des articles.
- Responsive, design sobre.

## CHANGELOG
- 2026-02-09 : MVP initial — React + FastAPI + Mongo + Google Auth + UI institutionnelle.
- 2026-02-09 : PDF generation via html2pdf.js, MDEditor remplace react-quill.
- 2026-02-16 : Restriction admin via `ADMIN_EMAILS` env var.
- 2026-05-16 : Mises à jour textuelles (Home, Contact, logo, typo Énergétique).
- 2026-05-16 : **Fix CORS P0** — `allow_origins=["*"]` + `allow_credentials=True` violait la spec CORS → browsers bloquaient. Listé explicitement les origines + `allow_origin_regex` pour emergent domains. Validé en preview.
- 2026-05-16 : **Refactor Object Storage** — Cover images base64 → Emergent Object Storage. Nouveaux fichiers : `backend/storage.py`, `backend/migrate_cover_images.py`. Endpoint `POST /api/admin/upload` retourne URL `/api/files/...`. Endpoint public `GET /api/files/{path:path}` sert les fichiers avec Cache-Control immutable. 1 article migré. **Payload `/api/articles` : 2,4MB → 5KB (474x plus rapide)**. Backend 100% testé (15/15 pytest tests).

## Active Issues / Pending
- 🔴 P0 Production : Redéploiement requis pour appliquer fix CORS + Object Storage sur `haako.online`.

## Roadmap (Backlog)
- **P1** Newsletter (SendGrid ou Resend).
- **P2** Recherche full-text sur articles.
- **P2** Multilingue FR/EN/AR.
- **P3** Refacto `server.py` (~600 lignes) en routers séparés (auth, articles, files).

## Admin Credentials
- diopoumar03@gmail.com
- abdoulayediop9@hotmail.com
- abdoullahidiopthiam@gmail.com
(via Google OAuth uniquement, contrôlé par `ADMIN_EMAILS` dans `backend/.env`)

## Key API Endpoints
- `GET /api/articles` (public, paginé + filtres)
- `GET /api/articles/count`
- `GET /api/articles/{slug}`
- `GET /api/files/{path:path}` (public, sert images uploadées avec Cache-Control immutable)
- `POST /api/admin/upload` (admin, upload → Object Storage)
- `POST /api/auth/session`, `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/contact`
- `*` `/api/admin/...` (protégés)

## Files of Reference
- `/app/backend/server.py` — Routes API + middleware CORS + upload + file serving
- `/app/backend/storage.py` — Helpers Emergent Object Storage (init/put/get)
- `/app/backend/migrate_cover_images.py` — Script migration base64 → object storage
- `/app/backend/tests/test_public_endpoints.py` — Tests pytest backend
- `/app/backend/.env` — `EMERGENT_LLM_KEY`, `APP_NAME`, `CORS_ORIGINS`, `ADMIN_EMAILS`, `MONGO_URL`
- `/app/frontend/src/lib/api.js` — Client axios `withCredentials: true`
- `/app/frontend/src/pages/Blog.jsx`, `ArticleDetail.jsx`
- `/app/frontend/src/pages/admin/ArticleEditor.jsx` — Upload via `adminArticlesAPI.uploadImage`
