import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";


const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});

export default function FeedbackForm() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/v1/feedback/";

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // load feedback
  const loadFeedbacks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setFeedbacks(data);
  };

  // submit form
  const onSubmit = async (formData) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, rating }),
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

    reset(); // resets form
    setRating(0);

    // loadFeedbacks();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/feedback/${id}/`, {
        method: "DELETE",
      });
      // remove deleted feedback from state
      setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


    useEffect(() => {
      loadFeedbacks();
    }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Submit Feedback
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              {...register("name")}
              className="w-full border p-3 rounded-lg"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full border p-3 rounded-lg"
              placeholder="Your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Comment *
            </label>
            <textarea
              rows="4"
              {...register("comment")}
              className="w-full border p-3 rounded-lg"
              placeholder="Write your feedback..."
            />
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <p className="text-gray-700 font-medium mb-1">Rating</p>
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

          {success && (
            <p className="text-green-600 font-semibold mb-4">
              ✅ Feedback submitted
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Feedback list */}
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          All Feedback
        </h3>

        {feedbacks.length === 0 && (
          <p className="text-gray-500 text-center">No feedback yet.</p>
        )}

        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border rounded-xl p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">{fb.name}</p>
                  <p className="text-sm text-gray-500">{fb.email}</p>
                </div>
                <div className="flex">
                  <div className="flex column justify-between">
                    {[...Array(fb.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                    <Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
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
