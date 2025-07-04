
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { addReview } from '@/redux/product/productSlice';
import axiosInstance from '@/lib/axios';

interface Props {
  productId: number;
  isRated: number;
  onSubmitSuccess?: () => void;
  setProduct?: React.Dispatch<React.SetStateAction<any>>;
}

const RateForm = ({ productId, isRated, onSubmitSuccess, setProduct }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please select a star rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write your review');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('product_id', String(productId));
      formData.append('value', String(rating));
      formData.append('description', reviewText);

      await axiosInstance.post('api/rates', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const newReview = {
        id: Date.now(),
        value: rating,
        description: reviewText,
        created_at: new Date().toLocaleString(),
        user_name: user?.name || 'You',
        user_image: user?.image || '',
      };

      dispatch(addReview(newReview));

      setProduct?.((prev) => {
        if (!prev) return prev;
        const updatedRates = [newReview, ...prev.rates];
        const updatedDetails = prev.rate_details.map((d: any) =>
          d.value === rating ? { ...d, count: d.count + 1 } : d
        );
        const newRateCount = prev.rate_count + 1;
        const newAvg = (
          (parseFloat(prev.rate_avg) * prev.rate_count + rating) / newRateCount
        ).toFixed(1);

        return {
          ...prev,
          is_rated: 1,
          rate_count: newRateCount,
          rate_avg: newAvg,
          rates: updatedRates,
          rate_details: updatedDetails,
        };
      });

      toast.success('Thank you for your review!');
      setRating(0);
      setReviewText('');
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRated !== 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-center bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-2">How many stars would you give our service?</h3>

      <div className="flex gap-1 mb-6 items-center justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="focus:outline-none"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={28}
              className={`
                ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                hover:scale-110 transition-transform
              `}
            />
          </button>
        ))}
      </div>
      <p className="text-gray-600 mb-6">Can you tell us more?</p>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-black  resize-none"
      />

      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
};

export default RateForm;
