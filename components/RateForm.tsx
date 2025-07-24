'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { addReview } from '@/redux/product/productSlice';

interface Props {
  productId: number;
  isRated: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProduct: React.Dispatch<React.SetStateAction<any>>;
}

const RateForm = ({ productId, isRated, setProduct }: Props) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error('Please provide a rating and a review.');
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading('Submitting your review...');

      const formData = new FormData();
      formData.append('product_id', String(productId));
      formData.append('value', String(rating));
      formData.append('description', reviewText);

      const res = await axiosInstance.post('api/rates', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const newReview = {
        id: res.data.id || Date.now(),
        value: rating,
        description: reviewText,
        created_at: new Date().toISOString(),
        user_id: user?.id || 0, 
        user_name: user?.name || 'Anonymous',
        user_image: user?.image || 'https://backend.outletplus.sa/storage/106/profile_image-2025.01.306286.jpeg',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProduct((prev: any) => ({
        ...prev,
        is_rated: 1,
        rate_count: prev.rate_count + 1,
        rate_avg: (
          (parseFloat(prev.rate_avg) * prev.rate_count + rating) /
          (prev.rate_count + 1)
        ).toFixed(1),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rate_details: prev.rate_details.map((d: any) =>
          d.value === rating ? { ...d, count: d.count + 1 } : d
        ),
        rates: [newReview, ...prev.rates],
      }));

      dispatch(addReview(newReview));

      toast.dismiss();
      toast.success('Thank you for your review!');
      setRating(0);
      setReviewText('');
    } catch {
      toast.dismiss();
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRated === 1) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-md shadow">
        <p className="text-teal-700 font-semibold">You have already rated this product.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-black">Leave a Review</h3>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)}>
            <Star
              size={28}
              className={`${
                rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
        className="w-full border rounded p-2 mb-4"
        placeholder="Write your review here..."
        disabled={isSubmitting}
      ></textarea>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 cursor-pointer"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default RateForm;
