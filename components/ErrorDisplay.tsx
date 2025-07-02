import { ChevronLeft } from 'lucide-react';

interface ErrorDisplayProps {
  error?: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-red-100 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
        <p className="text-gray-700 mb-4">
          {error || 'The product you are looking for does not exist.'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;