'use client';

import { Star } from 'lucide-react';
import Barcode from 'react-barcode';
import ProductActions from './ProductActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    price: string;
    barcode: string;
    brand_name: string;
    description?: string;
    category?: string;
    stock?: number;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { rate_avg, rate_count } = useSelector((state: RootState) => state.product);
  const ratingNumber = parseFloat(rate_avg || '0');
  const isInStock = product.stock ? product.stock > 0 : true;

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-teal-400 mb-2">
          {product.name}
        </h1>
        
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-8 mb-6">
        <div className="flex items-center gap-1">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(ratingNumber)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-700">
            {ratingNumber.toFixed(1)} ({rate_count} {rate_count === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="px-2 py-1">
          <Barcode 
            value={product.barcode} 
            height={25} 
            fontSize={10} 
            width={1.2}
            background="transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-3xl text-gray-700 font-normal">
          {parseFloat(product.price).toFixed(2)} <span className="text-base font-medium text-gray-600">SAR</span>
        </div>
        {product.stock && (
          <div className={`text-sm mt-1 ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
            {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>
        )}
      </div>

      {product.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">{product.description}</p>
        </div>
      )}

      <ProductActions 
        isInStock={isInStock} 
        productName={product.name}
        price={product.price}
      />
    </div>
  );
};

export default ProductInfo;
