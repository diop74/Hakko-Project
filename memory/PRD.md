# PRD — HAAKO

## Original Problem Statement
Plateforme web full-stack pour HAAKO, une application d'intelligence stratégique et de recherche dédiée à l'accès à l'énergie, au climat et au développement durable en Afrique (Mauritanie en particulier).

## Stack
- Frontend : React 19, TailwindCSS, Framer Motion, MDEditor, html2pdf.js
- Backend : FastAPI, MongoDB (Motor)
- Auth : Emergent-managed Google Auth (restreint à 3 emails via `.env`)
- Design : "Swiss-Eco" institutionnel, vert profond #1B5E20

## User Personas
- **Visiteur public** : Lit les articles, About, Solutions, Contact (sans authentification).
- **Admin** : Crée/édite articles, voit dashboard et messages contact (3 emails autorisés uniquement).

## Core Requirements
- Pages publiques : Accueil, À propos, Solutions (sous-pages), Blog (articles, catégories, tags), Contact.
- Dashboard admin sécurisé (CMS articles + pages).
- Téléchargement PDF des articles.
- Responsive, design sobre.

## CHANGELOG
- 2026-02-09 : MVP initial — React + FastAPI + Mongo + Google Auth + UI institutionnelle.
- 2026-02-09 : PDF generation via html2pdf.js, MDEditor remplace react-quill.
- 2026-02-16 : Restriction admin via `ADMIN_EMAILS` env var.
- 2026-05-16 : Mises à jour textuelles (Home, Contact, logo, typo Énergétique).
- 2026-05-16 : **Fix CORS P0** — Backend `allow_origins=["*"]` + `allow_credentials=True` incompatible → la spec CORS exige une origine spécifique avec credentials. Browser bloquait la réponse `/api/articles` → "0 articles trouvés" pour public. Fix : `CORS_ORIGINS` listé explicitement + `allow_origin_regex` pour domaines emergent. Validé en preview (4 articles affichés). **Doit être redéployé en production** pour résoudre `haako.online`.

## Active Issues / Pending
- 🔴 P0 Production : Redéploiement requis pour appliquer fix CORS sur `haako.online`.
- 🟡 P1 : Refactor `cover_image` base64 → stockage objet (payload actuellement ~150KB par article).

## Roadmap (Backlog)
- **P1** Newsletter (SendGrid ou Resend).
- **P1** Refactor stockage images (Emergent object storage).
- **P2** Recherche full-text sur articles.
- **P2** Multilingue FR/EN/AR.

## Admin Credentials
- diopoumar03@gmail.com
- abdoulayediop9@hotmail.com
- abdoullahidiopthiam@gmail.com
(via Google OAuth uniquement, contrôlé par `ADMIN_EMAILS` dans `backend/.env`)

## Key API Endpoints
- `GET /api/articles` (public, liste paginée + filtres)
- `GET /api/articles/count`
- `GET /api/articles/{slug}`
- `POST /api/auth/session`, `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/contact`
- `*` `/api/admin/...` (protégés)

## Files of Reference
- `/app/backend/server.py` — Routes API + middleware CORS
- `/app/backend/.env` — `CORS_ORIGINS`, `ADMIN_EMAILS`, `MONGO_URL`
- `/app/frontend/src/lib/api.js` — Axios client `withCredentials: true`
- `/app/frontend/src/pages/Blog.jsx`, `ArticleDetail.jsx`
