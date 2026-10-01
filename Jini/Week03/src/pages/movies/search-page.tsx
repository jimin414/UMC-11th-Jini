import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12">
      <h1 className="mb-8 text-[32px] font-bold">영화 검색</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 flex w-full max-w-[600px] gap-3"
      >
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 검색해 주세요."
          className="min-w-0 flex-1 rounded-[8px] border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          className="shrink-0 rounded-[8px] bg-indigo-500 px-6 py-3 font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-gray-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-[24px] font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-2 text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="space-y-6">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex flex-col gap-5 rounded-[12px] border border-gray-200 p-5 sm:flex-row"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="w-full rounded-[8px] object-cover sm:w-[180px]"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <h3 className="text-[20px] font-bold">
                        {movie.title}
                      </h3>
                    </Link>

                    <p className="mt-1 text-[14px] text-gray-500">
                      {movie.originalTitle}
                    </p>

                    <p className="mt-3 text-[14px] text-gray-500">
                      {movie.releaseDate}
                    </p>

                    <p className="mt-4 leading-7 text-gray-700">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-5 w-fit font-semibold text-indigo-600"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}