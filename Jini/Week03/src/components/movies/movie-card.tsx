import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-[10px] bg-white">
      <div className="relative aspect-[3/3.45] w-full overflow-hidden rounded-[8px] bg-[#e5e7eb]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
           className={cn(
              "absolute top-[10px] right-[10px] flex h-9 w-9 items-center justify-center border-0 bg-transparent p-0",
              movie.isBookmarked ? "opacity-100" : "opacity-80",
           )}
           type="button"
           onClick={() => onToggleBookmark(movie.id)}
           aria-label={`${movie.title} 북마크`}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-9 w-9"
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="my-0 mt-2 mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold">
          {movie.title}
        </h2>
      </Link>

      <p className="m-0 text-[12px] text-[#9ca3af]">
        {movie.releaseDate}
      </p>
    </article>
  );
}