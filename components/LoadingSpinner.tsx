export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-200 rounded-full mb-4 animate-spin border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    </div>
  );
}