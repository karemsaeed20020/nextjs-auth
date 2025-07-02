'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ReviewList = () => {
  const reviews = useSelector((state: RootState) => state.product.rates);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((r, index) => (
          <div key={index} className="border rounded-md p-4 mb-3 bg-white text-black shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <img src={r.user_image || "https://backend.outletplus.sa/storage/106/profile_image-2025.01.306286.jpeg"} alt="user" className="w-10 h-10 rounded-full" />
              <span className="font-medium">{r.user_name}</span>
            </div>
            <p className="text-yellow-500">Rating: {r.value} / 5</p>
            <p className="text-sm text-gray-600">{r.created_at}</p>
            <p className="mt-2">{r.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
