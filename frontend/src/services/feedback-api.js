import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const API_URL = import.meta.env.VITE_API_BASE_URL;

// FETCH FEEDBACKS
export function useGetFeedbacksQuery() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      return res.json();
  },
  });
}

// CREATE FEEDBACK
export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create feedback");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks"]);
    },
  });
}

// DELETE FEEDBACK
export function useDeleteFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete feedback");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feedbacks"]);
    },
  });
}

export const feedbackService = {
  useGetFeedbacksQuery,
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
};

export default feedbackService;
