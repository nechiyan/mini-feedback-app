import FeedbackItem from "./FeedbackItem";
import Pagination from "./Pagination";
import { useGetFeedbacksQuery } from "../services/feedback-api";
import FeedbackListSkeleton from "./FeedbackListSkeleton";
import { useEffect } from "react";

export default function FeedbackList({
  page,
  setPage,
  ordering,
  setOrdering,
  search,
  searchText,
  setSearchText,
}) {
  const { data, isLoading, error } = useGetFeedbacksQuery(
    page,
    ordering,
    search
  );
  const feedbacks = data?.results || 'N/A';
  const next = data?.next;
  const previous = data?.previous;

    useEffect(() => {
      if (!isLoading && feedbacks?.length === 0 && page > 1) {
        setPage(page - 1);
      }
    }, [feedbacks, isLoading, page, setPage]);

  if (isLoading) return <FeedbackListSkeleton count={5} />;
  if (error)
    return <p className="text-red-600 text-center">Failed to load feedback.</p>;

  return (
    <div className="bg-gray-50 p-8 rounded-2xl border">
      <h3 className="text-2xl font-bold text-center">All Feedback</h3>

      <SearchAndSort
        searchText={searchText}
        setSearchText={setSearchText}
        ordering={ordering}
        setOrdering={setOrdering}
        setPage={setPage}
      />

      <div className="space-y-4 mt-4">
        {feedbacks.length === 0 && (
          <p className="text-center">No feedback yet.</p>
        )}
        {feedbacks.map((fb) => (
          <FeedbackItem key={fb.id} feedback={fb} page={page} />
        ))}
      </div>

      <Pagination previous={previous} next={next} setPage={setPage} />
    </div>
  );
}

function SearchAndSort({
  searchText,
  setSearchText,
  ordering,
  setOrdering,
  setPage,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between mt-4 gap-4">
      <input
        type="text"
        placeholder="Search feedback..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1);
        }}
        className="border p-2 rounded-lg w-full md:w-1/3"
      />
      <select
        className="border p-2 rounded-lg"
        value={ordering}
        onChange={(e) => {
          setOrdering(e.target.value);
          setPage(1);
        }}
      >
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="-rating">Highest Rating</option>
        <option value="rating">Lowest Rating</option>
      </select>
    </div>
  );
}
