// SwipeDeck.jsx
// Manages a stack of SwipeCards. Only the top card is draggable;
// the rest peek out slightly behind it for visual depth.
//
// Also provides on-screen buttons (❌ / ❤️) so this works without
// a touchscreen or mouse-drag - important for demo videos and for
// anyone testing on desktop.

import { AnimatePresence } from "framer-motion";
import SwipeCard from "./SwipeCard.jsx";

export default function SwipeDeck({ movies, onDecision }) {
  // Show at most 3 stacked cards at a time - better performance,
  // and older cards further back don't need to render at all.
  const visibleMovies = movies.slice(0, 3);

  function handleSwipe(decision, movie) {
    onDecision(decision, movie);
  }

  if (movies.length === 0) {
    return (
      <div className="swipe-deck swipe-deck--empty">
        <p>No more movies! 🎉</p>
      </div>
    );
  }

  return (
    <div className="swipe-deck-wrapper">
      <div className="swipe-deck">
        <AnimatePresence>
          {visibleMovies.map((movie, index) => (
            <SwipeCard
              key={movie.id}
              movie={movie}
              isTopCard={index === 0}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="swipe-buttons">
        <button
          className="swipe-button swipe-button--nope"
          onClick={() => handleSwipe("skipped", movies[0])}
          aria-label="Skip"
        >
          ✕
        </button>
        <button
          className="swipe-button swipe-button--like"
          onClick={() => handleSwipe("liked", movies[0])}
          aria-label="Like"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
