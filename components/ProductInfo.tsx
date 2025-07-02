'use client';

import { Star } from 'lucide-react';
import Barcode from 'react-barcode';
import ProductActions from './ProductActions';

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    price: string;
    barcode: string;
    rate_avg: string;
    rate_count: number;
    brand_name: string;
    description?: string;
    category?: string;
    stock?: number;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const ratingNumber = parseFloat(product.rate_avg || '0');
  const isInStock = product.stock ? product.stock > 0 : true;

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <p className="text-sm text-gray-600">
          Brand: <span className="font-medium text-gray-800">{product.brand_name}</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`${
                  i < Math.round(ratingNumber)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-700">
            {ratingNumber.toFixed(1)} ({product.rate_count} reviews)
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm">
          <Barcode 
            value={product.barcode} 
            height={25} 
            fontSize={10} 
            width={1.2}
            background="transparent"
          />
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl font-extrabold text-blue-600">
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
      />
    </div>
  );
};

export default ProductInfo;