export default function Pagination() {
  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent"
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="h-4 w-4"
        />
      </button>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-[6px] border-0 bg-[#17181c] font-bold text-white"
      >
        1
      </button>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent"
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="h-4 w-4"
        />
      </button>
    </nav>
  );
}