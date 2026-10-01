import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[96px] w-full max-w-[1280px] items-center px-5">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src="/icons/movie.svg"
            alt="UMCine 로고"
            className="h-8 w-8"
          />
          <span className="text-[24px] font-bold text-black">
            UMCine
          </span>
        </Link>

        <nav className="ml-16 hidden items-center gap-10 md:flex">
          <Link
            to="/"
            className="text-[16px] text-gray-700 hover:text-black"
          >
            영화
          </Link>

          <Link
            to="/search"
            className="text-[16px] text-gray-700 hover:text-black"
          >
            검색
          </Link>

          <a
            href="#"
            className="text-[16px] text-gray-700 hover:text-black"
          >
            내 정보
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-gray-200"
          >
            <img
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
            />
          </Link>

          <button
            className="h-12 rounded-[8px] bg-indigo-500 px-6 text-[18px] font-bold text-white"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}