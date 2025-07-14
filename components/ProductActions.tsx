'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  isInStock: boolean;
  productName: string;
  price: string;
}

const ProductActions = ({ isInStock, productName }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${productName} to cart`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-5 bg-slate-300 rounded-full overflow-hidden">
          <button
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-slate-600 text-white hover:bg-slate-500 transition disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-4 py-2 w-12 text-center text-black border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-500 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`px-8 py-2 cursor-pointer rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isInStock 
              ? 'bg-teal-500 hover:bg-teal-600 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>

    </div>
  );
};

export default ProductActions;
