import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateFeedbackMutation } from "../services/feedback-api";
import successAnimation from "../assets/success.json";
import { Player } from "@lottiefiles/react-lottie-player";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  comment: z.string().optional(),
  phone_number: z.string().optional(),
  rating: z.number().min(1, "Rating is required"),
});

export default function FeedbackInputForm() {
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const createFeedback = useCreateFeedbackMutation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const onSubmit = async (formData) => {
    await createFeedback.mutateAsync({ ...formData, rating });
    setSuccess(true);
    reset();
    setRating(0);
    setValue("rating", 0);

    // auto close modal after 2s
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-gray-50 p-8 rounded-2xl border relative">
      <h2 className="text-3xl font-bold text-center mb-6">Submit Feedback</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField label="Name" {...register("name")} error={errors.name} />
        <InputField label="Email" {...register("email")} error={errors.email} />
        <InputField
          label="mobile"
          {...register("phone_number")}
          error={errors.phone_number}
        />
        <TextareaField
          label="Comment"
          {...register("comment")}
          error={errors.comment}
        />
        <RatingField
          rating={rating}
          setRating={setRating}
          setValue={setValue}
        />
        <button
          disabled={createFeedback.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Submit
        </button>
      </form>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4">
            <Player
              autoplay
              loop={false}
              src={successAnimation}
              style={{ height: 150, width: 150 }}
            />
            <p className="text-xl font-semibold text-green-600">
              Feedback Submitted!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ----- Fields -----
function InputField({ label, error, ...rest }) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} className="w-full border p-3 rounded-lg" />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}

function TextareaField({ label, error, ...rest }) {
  return (
    <div>
      <label>{label}</label>
      <textarea {...rest} rows="4" className="w-full border p-3 rounded-lg" />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}

function RatingField({ rating, setRating, setValue }) {
  return (
    <div>
      <label>Rating</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => {
              setRating(num);
              setValue("rating", num, { shouldValidate: true });
            }}
            className={`cursor-pointer text-3xl ${
              rating >= num ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
