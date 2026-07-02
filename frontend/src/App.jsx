// App.jsx
// Step 1 goal: prove the pipeline works end to end.
// Backend (Express) -> TMDB -> our /api/movies route -> this component.
// No swiping yet - that's Step 2, once we know data is flowing correctly.

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(`${API_URL}/api/movies`);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.movies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <p className="status-message">Loading movies…</p>;
  if (error) return <p className="status-message status-message--error">Error: {error}</p>;

  return (
    <div className="app">
      <h1>🎬 Movie Swiper</h1>
      <p className="subtitle">Step 1: movies loaded from our own backend, which talks to TMDB.</p>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;
