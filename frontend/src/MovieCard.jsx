// MovieCard.jsx
// A single movie card. Kept as its own component because in Step 2
// this is exactly what becomes swipeable - isolating it now means
// we won't need to restructure anything later.

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className="movie-card__poster"
        />
      ) : (
        <div className="movie-card__poster movie-card__poster--placeholder">
          No image
        </div>
      )}
      <div className="movie-card__info">
        <h2 className="movie-card__title">
          {movie.title} <span className="movie-card__year">({movie.releaseYear})</span>
        </h2>
        <p className="movie-card__rating">⭐ {movie.rating.toFixed(1)}</p>
        <p className="movie-card__overview">{movie.overview}</p>
      </div>
    </div>
  );
}
