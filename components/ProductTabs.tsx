'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewList from './ReviewList';
import RateForm from './RateForm';
import SimilarProducts from './SimilarProducts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Props {
  specifications: string;
  subCategoryId: number;
  currentId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProduct: React.Dispatch<React.SetStateAction<any>>;
  averageRating: number;
  ratingCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateDetails: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any[];
  isRated: number;
  token: string;
}

const ProductTabs = ({
  specifications,
  subCategoryId,
  currentId,
  setProduct,
  averageRating,
  ratingCount,
  rateDetails,
  reviews,
  isRated,
}: Props) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'specs'>('reviews');
  const user = useSelector((state: RootState) => state.auth.user);
 //  const userReview = reviews.find((r) => r.user_id === user?.id);
  const maxRating = Math.max(...rateDetails.map((r) => r.count || 0));

  return (
    <div className="mt-12 text-black w-full">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'reviews' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-600'
          }`}
        >
          Reviews ({ratingCount})
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'specs' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-600'
          }`}
        >
          Specifications
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'reviews' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col gap-6 lg:w-1/3">
              {/* Rating Summary */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-100 h-fit w-full">
                <p className="text-xl font-semibold text-black/70 mb-4">General Rating</p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-extrabold text-black">{averageRating.toFixed(1)}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const detail = rateDetails.find((r) => r.value === star);
                    const percent = detail?.count
                      ? Math.round((detail.count / (maxRating || 1)) * 100)
                      : 0;

                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center w-8">
                          <span className="text-sm font-medium text-gray-900">{star}</span>
                          <Star size={16} className="ml-1 text-amber-400" />
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right">{detail?.count || 0}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form only if not rated */}
              <RateForm productId={currentId} isRated={isRated} setProduct={setProduct} />
            </div>

            {/* Review List */}
            <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow border border-gray-100">
              <h3 className="text-xl font-semibold text-black/70 mb-6">
                Customer Reviews ({ratingCount})
              </h3>
              <ReviewList reviews={reviews} />
            </div>
          </div>
        ) : (
          <>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications:</h3>
              <div
                className="prose prose-sm text-gray-700 max-w-full"
                dangerouslySetInnerHTML={{ __html: specifications }}
              />
            </div>
            <div className="p-6">
              <SimilarProducts subCategoryId={subCategoryId} currentId={currentId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
