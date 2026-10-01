import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-5 py-16">
        <p className="text-[20px] font-semibold">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* 배경 이미지 */}
      <section className="relative overflow-hidden bg-black">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-black/50" />

        {/* 영화 정보 */}
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-12 text-white md:flex-row md:items-end md:py-20">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-[200px] shrink-0 rounded-[10px] object-cover shadow-lg md:w-[260px]"
          />

          <div className="flex flex-col">
            <Link
              to="/"
              className="mb-6 w-fit text-[14px] text-gray-200 hover:text-white"
            >
              ← 영화 목록
            </Link>

            <h1 className="text-[32px] font-bold md:text-[40px]">
              {movie.title}
            </h1>

            <p className="mt-2 text-[16px] text-gray-300">
              {movie.originalTitle}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[14px] text-gray-200">
              <span>{movie.releaseDate}</span>
              <span>·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>·</span>
              <span>{movie.runtime}</span>
            </div>

            <h2 className="mt-8 text-[22px] font-bold">
              {movie.tagline}
            </h2>

            <p className="mt-4 max-w-[700px] text-[16px] leading-7 text-gray-200">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}