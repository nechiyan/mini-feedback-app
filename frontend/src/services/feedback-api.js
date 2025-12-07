import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// FETCH FEEDBACKS (Paginated)
export function useGetFeedbacksQuery(page, ordering, search) {
  return useQuery({
    queryKey: ["feedbacks", page, ordering, search],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}?page=${page}&ordering=${ordering}&search=${search}`
      );
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
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
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
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}

export const feedbackService = {
  useGetFeedbacksQuery,
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
};

export default feedbackService;
