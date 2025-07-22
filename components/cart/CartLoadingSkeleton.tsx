export function CartLoadingSkeleton() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-6 p-6 border border-gray-200 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}