// server.js
// Entry point for the backend. Right now it just exposes one route:
// GET /api/movies -> returns a deck of trending movies for the frontend
// to swipe through.
//
// Why does the frontend not call TMDB directly? Two reasons:
// 1. Our TMDB access token stays secret on the server (never shipped to browsers)
// 2. Later, this is where we'll add session/socket logic without the
//    frontend needing to know anything changed

import "dotenv/config";
import express from "express";
import cors from "cors";
import { getTrendingMovies } from "./tmdb.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health check - useful once this is deployed, to confirm it's alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Returns a deck of movies to swipe through
app.get("/api/movies", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const movies = await getTrendingMovies(page);
    res.json({ movies });
  } catch (error) {
    console.error("Failed to fetch movies:", error.message);
    res.status(500).json({ error: "Could not fetch movies from TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`Movie Swiper backend running on http://localhost:${PORT}`);
});
