# 🎬 Movie Swiper

A Tinder-style app for groups deciding what to watch. Everyone swipes on movies in real time — when the whole group likes the same one, it's a match.

**Status:** 🚧 Work in progress — building in public, step by step.

- [x] Step 1: Backend fetches movies from TMDB, frontend displays them
- [ ] Step 2: Swipe gesture (like/skip)
- [ ] Step 3: Real-time sessions with Socket.io
- [ ] Step 4: Match detection
- [ ] Step 5: Deploy live

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Real-time:** Socket.io (coming in Step 3)
- **External API:** [TMDB](https://www.themoviedb.org/)

## Running locally

### Backend
```bash
cd backend
cp .env.example .env   # then paste your TMDB access token in .env
npm install
npm run dev
```
Runs on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Why this project

Built as a portfolio project to demonstrate real-time architecture (Socket.io), third-party API integration, and clean full-stack structure — not just CRUD.

---
This product uses the TMDB API but is not endorsed or certified by TMDB.
