export default function FeedbackListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 mt-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
}
