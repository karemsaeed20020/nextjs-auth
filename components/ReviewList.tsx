
'use client';
import { Star } from 'lucide-react';
import { formatDistanceToNowStrict, parseISO, differenceInSeconds } from 'date-fns';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReviewList = ({ reviews }: { reviews: any[] }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const renderTimeAgo = (createdAt: string) => {
    try {
      const date = parseISO(createdAt);
      const secondsAgo = differenceInSeconds(new Date(), date);
      if (secondsAgo < 60) return 'Just now';
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } catch {
      return createdAt;
    }
  };

  return (
    <div className="w-full">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className={`border rounded-md p-4 mb-3 bg-white text-black shadow-sm transition ${
              review.user_id === currentUser?.id ? 'border-black' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              {review.user_image ? (
                <Image
                  src={review.user_image}
                  alt={review.user_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                  {review.user_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{review.user_name}</span>
                  {review.user_id === currentUser?.id && (
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                      Your review
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{renderTimeAgo(review.created_at)}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
