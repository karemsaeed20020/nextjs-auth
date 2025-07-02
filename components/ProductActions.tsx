'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  isInStock: boolean;
  productName: string;
}

const ProductActions = ({ isInStock, productName }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${productName} to cart`);
  };

  return (
    <>
      {/* Quantity Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-black/80 transition disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-lg font-semibold w-12 text-black text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-black/80 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
            isInStock 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </>
  );
};

export default ProductActions;