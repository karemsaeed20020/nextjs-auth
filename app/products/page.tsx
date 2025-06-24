'use client';
import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Slider from '@/components/Slider';
import ProductList from '@/components/ProductList';
import { SlidersHorizontal } from 'lucide-react';

interface Filters {
  rating: number | null;
  price: string | null;
  categoryIds: number[];
  brandIds: number[];
  subCategoryIds: number[]; 
}

const Products = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    rating: null,
    price: null,
    categoryIds: [],
    brandIds: [],
    subCategoryIds: [], 
  });

  
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []); 

  return (
    <div className="min-h-screen bg-gray-50">
      <Slider />

      {/* Mobile Filters Button */}
      <div className="lg:hidden px-4 mt-4 flex justify-end">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
          <div className="w-72 sm:w-80 bg-white h-full p-4 overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <Sidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-8">
        <aside className="hidden lg:block lg:w-[400px]">
          <Sidebar onFilterChange={handleFilterChange} />
        </aside>

        <main className="flex-1">
          <h2 className="text-xl text-black font-semibold mb-4">Best Selling Products</h2>
          <ProductList filters={filters} /> 
        </main>
      </div>
    </div>
  );
};

export default Products;