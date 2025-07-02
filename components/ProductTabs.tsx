'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import SimilarProducts from './SimilarProducts';
import ReviewList from './ReviewList';

interface RateDetail {
  value: number;
  count: number;
}

interface Props {
  averageRating: number;
  ratingCount: number;
  rateDetails: RateDetail[];
  specifications: string;
  subCategoryId: number;
  currentId: number;
}

const ProductTabs = ({
  averageRating,
  ratingCount,
  rateDetails,
  specifications,
  subCategoryId,
  currentId,
}: Props) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'specs'>('reviews');
  const maxRating = Math.max(...rateDetails.map((r) => r.count || 0));

  return (
    <div className="mt-12 text-black w-full">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
          }`}
        >
          Reviews ({ratingCount})
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'specs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
          }`}
        >
          Specifications
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'reviews' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 w-full h-[400px] bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="text-center mb-6">
                <span className="text-5xl font-extrabold text-indigo-600">{averageRating.toFixed(1)}</span>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      className={`${
                        i < Math.round(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Based on <span className="font-semibold">{ratingCount}</span> review{ratingCount !== 1 && 's'}
                </p>
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
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">
                        {detail?.count || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <ReviewList />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
              <div className="prose prose-sm text-gray-700 max-w-none">
                {specifications ? (
                  <div dangerouslySetInnerHTML={{ __html: specifications }} />
                ) : (
                  <p className="text-gray-500">No specifications provided.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar Products</h3>
              <SimilarProducts subCategoryId={subCategoryId} currentId={currentId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
