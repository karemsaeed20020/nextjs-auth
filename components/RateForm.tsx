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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProduct?: React.Dispatch<React.SetStateAction<any>>; 
}

const RateForm = ({ productId, isRated, onSubmitSuccess, setProduct }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch(); 

  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value || !description) {
      toast.error('Please provide a rating and comment');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('product_id', String(productId));
      formData.append('value', String(value));
      formData.append('description', description);

      await axiosInstance.post('api/rates', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const review = {
        id: Date.now(),
        value,
        description,
        created_at: new Date().toLocaleString(),
        user_name: user?.name || 'You',
        user_image: user?.image || '',
      };

      dispatch(addReview(review));

      setProduct?.((prev) => {
        if (!prev) return prev;
        const updatedRates = [review, ...prev.rates];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedDetails = prev.rate_details.map((d: any) =>
          d.value === value ? { ...d, count: d.count + 1 } : d
        );
        const newRateCount = prev.rate_count + 1;
        const newAvg = (
          (parseFloat(prev.rate_avg) * prev.rate_count + value) / newRateCount
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

      toast.success('Thanks for your review!');
      setValue(0);
      setDescription('');
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (isRated !== 0) return null;

  return (
    <div className="mt-10 bg-white max-w-5xl mx-auto p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Your Review</h3>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={28}
            className={`cursor-pointer ${
              value >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setValue(star)}
          />
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="Write your comment..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default RateForm;


