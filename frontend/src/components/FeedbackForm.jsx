import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useCreateFeedbackMutation, useDeleteFeedbackMutation, useGetFeedbacksQuery } from "../services/feedback-api";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const { data: feedbacks = [], isLoading } = useGetFeedbacksQuery();
  const createFeedback = useCreateFeedbackMutation();
  const deleteFeedback = useDeleteFeedbackMutation();
  const queryClient = useQueryClient(); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    await createFeedback.mutateAsync({ ...formData, rating });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

    reset();
    setRating(0);
  };

const handleDelete = async (id) => {
    queryClient.setQueryData(["feedbacks"], (old = []) =>
      old.filter((fb) => fb.id !== id)
    );

  try {
    await deleteFeedback.mutateAsync(id);
    queryClient.invalidateQueries(["feedbacks"]);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};



  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* FORM */}
      <div className="bg-gray-50 p-8 rounded-2xl border">
        <h2 className="text-3xl font-bold text-center">Submit Feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label>Name</label>
            <input
              {...register("name")}
              className="w-full border p-3 rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input
              {...register("email")}
              className="w-full border p-3 rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label>Comment *</label>
            <textarea
              {...register("comment")}
              rows="4"
              className="w-full border p-3 rounded-lg"
            />
            {errors.comment && (
              <p className="text-red-500">{errors.comment.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label>Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  className={`cursor-pointer text-3xl ${
                    rating >= num ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {success && <p className="text-green-600">✅ Feedback submitted</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-gray-50 p-8 rounded-2xl border">
        <h3 className="text-2xl font-bold text-center">All Feedback</h3>

        {feedbacks.length === 0 && (
          <p className="text-center">No feedback yet.</p>
        )}

        <div className="space-y-4 mt-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border rounded-xl p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{fb.name}</p>
                  <p className="text-sm text-gray-500">{fb.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  {[...Array(fb.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}

                  <Trash2
                    className="text-red-500 cursor-pointer"
                    size={20}
                    onClick={() => handleDelete(fb.id)}
                  />
                </div>
              </div>

              <p className="mt-2 text-gray-700">{fb.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
