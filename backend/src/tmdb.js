// tmdb.js
// Small wrapper around the TMDB API. Keeping all TMDB-specific logic
// in one file means if TMDB changes their API, you only edit here.

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetches a page of trending movies (this week) from TMDB.
 * Docs: https://developer.themoviedb.org/reference/trending-movies
 */
export async function getTrendingMovies(page = 1) {
  const url = `${TMDB_BASE_URL}/trending/movie/week?page=${page}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`TMDB request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // We reshape the raw TMDB response into just what our frontend needs.
  // This keeps our API contract stable even if TMDB's shape changes.
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    rating: movie.vote_average,
    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
  }));
}
