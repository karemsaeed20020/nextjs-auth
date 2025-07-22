import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartEmptyStateProps {
  isLoggedIn: boolean;
}

export function CartEmptyState({ isLoggedIn }: CartEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isLoggedIn ? "Your cart is empty" : "Please login to view your cart"}
        </h2>
        <p className="text-gray-600 mb-8">
          {isLoggedIn 
            ? "Looks like you haven't added any items yet" 
            : ""}
        </p>
        <button 
          onClick={() => router.push(isLoggedIn ? '/products' : '/login')}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {isLoggedIn ? "Continue Shopping" : "Login to Continue"}
        </button>
      </div>
    </div>
  );
}