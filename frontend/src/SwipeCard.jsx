// SwipeCard.jsx
// A single draggable movie card. Uses framer-motion's drag gesture:
// - drag it far enough left/right and it flies off screen (a decision)
// - release it near center and it snaps back (no decision made)
//
// This component doesn't know anything about "matching" or sessions -
// it only reports back "liked" or "skipped" via a callback. Keeping it
// dumb like this makes it easy to reuse later and easy to test.

import { motion, useMotionValue, useTransform } from "framer-motion";

const SWIPE_THRESHOLD = 120; // pixels of drag needed to count as a decision

export default function SwipeCard({ movie, onSwipe, isTopCard }) {
  const x = useMotionValue(0);

  // As the card is dragged, rotate it slightly and fade the LIKE/NOPE stamps in
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  function handleDragEnd(_event, info) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("liked", movie);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("skipped", movie);
    }
    // otherwise: framer-motion automatically springs the card back to center
  }

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTopCard ? 1 : 0.95, y: isTopCard ? 0 : 10 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } }}
    >
      {isTopCard && (
        <>
          <motion.div className="swipe-stamp swipe-stamp--like" style={{ opacity: likeOpacity }}>
            LIKE
          </motion.div>
          <motion.div className="swipe-stamp swipe-stamp--nope" style={{ opacity: nopeOpacity }}>
            NOPE
          </motion.div>
        </>
      )}

      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="swipe-card__poster" />
      ) : (
        <div className="swipe-card__poster swipe-card__poster--placeholder">No image</div>
      )}

      <div className="swipe-card__info">
        <h2 className="swipe-card__title">
          {movie.title} <span className="swipe-card__year">({movie.releaseYear})</span>
        </h2>
        <p className="swipe-card__rating">⭐ {movie.rating.toFixed(1)}</p>
        <p className="swipe-card__overview">{movie.overview}</p>
      </div>
    </motion.div>
  );
}
