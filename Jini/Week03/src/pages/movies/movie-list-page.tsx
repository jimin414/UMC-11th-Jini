import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-[1240px] px-10 pt-7 pb-[100px]">
        <h1 className="mb-6 text-[32px] font-bold">
          영화 목록
        </h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination />
      </main>

      <footer className="flex min-h-14 items-center justify-center gap-2 border-t border-gray-200 bg-white px-10 py-4 text-[11px] text-gray-500">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-auto w-6"
        />

        <span>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </span>
      </footer>
    </>
  );
}