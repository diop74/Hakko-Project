# HAAKO - Product Requirements Document

## Original Problem Statement
HAAKO est une plateforme d'analyse, de recherche appliquée et de communication stratégique dédiée à l'accès à l'énergie, la transition énergétique, le climat et le développement durable en Afrique, avec ancrage en Mauritanie. Le nom signifie "vert" en peul (pulaar).

## User Personas
1. **Investisseurs et développeurs de projets énergétiques** - Recherchent des analyses de marché et études de faisabilité
2. **Institutions gouvernementales** - Besoin de données pour la prise de décision politique
3. **Institutions multilatérales** - Évaluation de projets et programmes
4. **ONG spécialisées** - Suivi des enjeux environnementaux
5. **Société civile** - Accès à l'information et sensibilisation

## Core Requirements
- Site institutionnel sobre et professionnel
- Blog avec éditeur WYSIWYG pour analyses et insights
- Système d'administration sécurisé (Google Auth)
- Formulaire de contact
- SEO optimisé, responsive design

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: Emergent Google OAuth
- **Fonts**: Manrope (headings) + DM Sans (body)
- **Primary Color**: #1B5E20 (HAAKO Green)

## What's Been Implemented (2026-02-09)

### Public Pages
- ✅ Homepage avec hero, stats, services, CTA
- ✅ About page (vision, mission, valeurs, champs d'intervention)
- ✅ Solutions page (Recherche & Analyse, Communication Stratégique)
- ✅ Solution detail pages
- ✅ Blog listing avec filtres (catégorie, thème)
- ✅ Article detail page avec partage social
- ✅ Contact page avec formulaire

### Admin Panel
- ✅ Dashboard avec statistiques
- ✅ Gestion des articles (CRUD)
- ✅ Éditeur WYSIWYG (React Quill)
- ✅ Gestion des messages de contact
- ✅ Authentification Google via Emergent

### Backend API
- ✅ /api/auth/* - Authentification
- ✅ /api/articles/* - CRUD articles
- ✅ /api/contact - Messages de contact
- ✅ /api/admin/* - Routes protégées

## Sample Data Created
- 3 articles exemples (Mauritanie, Afrique, Énergie)
- 1 utilisateur admin seed

## Prioritized Backlog

### P0 (Critical)
- ✅ All core features implemented

### P1 (High)
- Newsletter subscription integration
- Search functionality for blog
- Related articles suggestion

### P2 (Medium)
- Multi-language support (FR/EN/AR)
- Analytics dashboard
- PDF export for articles
- Social media integration

### P3 (Low)
- Dark mode
- Comments on articles
- User accounts for subscribers

## Next Tasks
1. Ajouter une fonctionnalité de newsletter (SendGrid/Resend)
2. Implémenter la recherche full-text sur les articles
3. Ajouter des métriques Google Analytics
4. Créer plus de contenu exemple
5. Optimiser SEO avec meta tags dynamiques
