import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft size={20} className="mr-2" />
          Continue Shopping
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Cart ({itemCount})
      </h1>
    </>
  );
}