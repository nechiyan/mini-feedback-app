import { useState } from "react";
import { useDebounce } from "use-debounce";
import FeedbackInputForm from "./FeedbackInputForm";
import FeedbackList from "./FeedbackList";

export default function FeedbackForm() {
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("-created_at");
  const [searchText, setSearchText] = useState("");
  const [search] = useDebounce(searchText, 500);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <FeedbackInputForm />
      <FeedbackList
        page={page}
        setPage={setPage}
        ordering={ordering}
        setOrdering={setOrdering}
        search={search}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </div>
  );
}
