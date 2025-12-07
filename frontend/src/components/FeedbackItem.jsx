import { Trash2 } from "lucide-react";
import { useDeleteFeedbackMutation } from "../services/feedback-api";
import { useQueryClient } from "@tanstack/react-query";

export default function FeedbackItem({ feedback, page }) {
  const deleteFeedback = useDeleteFeedbackMutation();
  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    queryClient.setQueryData(["feedbacks", page], (old) => {
      if (!old) return old;
      const updatedResults = old.results.filter((fb) => fb.id !== id);
      return { ...old, results: updatedResults };
    });
    await deleteFeedback.mutateAsync(feedback.id);
    queryClient.invalidateQueries(["feedbacks"]);
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{feedback.name}</p>
          <p className="text-sm text-gray-500">{feedback.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {[...Array(feedback.rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">
              ★
            </span>
          ))}
          <Trash2
            className="text-red-500 cursor-pointer"
            size={20}
            onClick={() => handleDelete(feedback.id)}
          />
        </div>
      </div>
      <p className="mt-2 text-gray-700">{feedback.comment}</p>
    </div>
  );
}
