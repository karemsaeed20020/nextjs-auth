import Image from 'next/image';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CartProduct } from '@/types/cart';

interface CartProductItemProps {
  product: CartProduct;
  isUpdating: boolean;
  updatingType: 'inc' | 'dec' | null;
  onRemove: (productId: number) => Promise<void>;
  onIncrease: (productId: number) => Promise<void>;
  onDecrease: (productId: number) => Promise<void>;
}

export function CartProductItem({
  product,
  isUpdating,
  updatingType,
  onRemove,
  onIncrease,
  onDecrease,
}: CartProductItemProps) {
  const price = parseFloat(product.offer_price) || parseFloat(product.price) || 0;
  const originalPrice = product.offer_price ? parseFloat(product.price) : null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 border border-gray-200 rounded-lg">
      <div className="relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 160px"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.brand_name}</p>
          </div>
          <button 
            onClick={() => onRemove(product.id)}
            className="cursor-pointer text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-black">
            <button
              onClick={() => onDecrease(product.id)}
              disabled={isUpdating || product.quantity <= 1}
              className="cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {isUpdating && updatingType === 'dec' ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            <span className="w-12 text-center text-gray-900 font-medium">
              {product.quantity}
            </span>
            <button
              onClick={() => onIncrease(product.id)}
              disabled={isUpdating}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {isUpdating && updatingType === 'inc' ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronUp size={16} />
              )}
            </button>
          </div>

          <div className="text-right">
            {originalPrice ? (
              <>
                <span className="text-gray-500 line-through mr-2 text-sm">
                  {originalPrice.toFixed(2)} SAR
                </span>
                <span className="font-bold text-gray-900">
                  {price.toFixed(2)} SAR
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-900">
                {price.toFixed(2)} SAR
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}