// App.jsx
// Step 2 goal: swiping actually works and we track what the user liked.
// Still no backend/session awareness of likes yet - that's Step 3,
// once swiping itself feels good.

import { useEffect, useState } from "react";
import SwipeDeck from "./SwipeDeck.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
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

  function handleDecision(decision, movie) {
    if (decision === "liked") {
      setLikedMovies((prev) => [...prev, movie]);
    }
    // Remove the decided card from the deck (whichever way it went)
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
  }

  if (loading) return <p className="status-message">Loading movies…</p>;
  if (error) return <p className="status-message status-message--error">Error: {error}</p>;

  return (
    <div className="app">
      <h1>🎬 Movie Swiper</h1>
      <p className="subtitle">Step 2: swipe right to like, left to skip.</p>

      <SwipeDeck movies={movies} onDecision={handleDecision} />

      {likedMovies.length > 0 && (
        <div className="liked-summary">
          <h3>You liked ({likedMovies.length}):</h3>
          <ul>
            {likedMovies.map((m) => (
              <li key={m.id}>{m.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
