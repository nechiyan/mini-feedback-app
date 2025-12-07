export default function Pagination({ previous, next, setPage }) {
  return (
    (previous || next) && (
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={!previous}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <button
          disabled={!next}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    )
  );
}
