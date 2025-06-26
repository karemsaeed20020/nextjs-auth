'use client';

import { useState, useEffect } from "react"; 
import CategoryFilter from "./CategoryFilter";
import SubCategoryFilter from "./SubCategoryFilter";
import BrandFilter from "./BrandFilter";
import { Star } from "lucide-react";

interface Filters {
  rating: number | null;
  price: string | null;
  categoryIds: number[];
  brandIds: number[];
  subCategoryIds: number[]; 
}

interface SidebarProps {
  onFilterChange: (filters: Filters) => void;
}

const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<number[]>([]); 

  useEffect(() => {
    onFilterChange({
      rating: selectedRating,
      price: selectedPrice,
      categoryIds: selectedCategoryIds,
      brandIds: selectedBrandIds,
      subCategoryIds: selectedSubCategoryIds, 
    });
  }, [selectedRating, selectedPrice, selectedCategoryIds, selectedBrandIds, selectedSubCategoryIds, onFilterChange]);

  return (
    <aside className="w-full lg:w-96 p-4 bg-white shadow-md rounded-xl space-y-6">
      {/* Rating */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">⭐ Rating</h4>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setSelectedRating((prev) => (prev === star ? null : star));
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="transition"
            >
              <Star
                size={22}
                className={`transition-all ${
                  (hoverRating !== null && star <= hoverRating) ||
                  (selectedRating !== null && star <= selectedRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
       {selectedRating !== null && (
  <button
    onClick={() => setSelectedRating(null)}
    className="text-black/50 text-sm mt-4 hover:underline hover:text-black transition"
  >
    Clear Rating Filter
  </button>
)}

      </div>

      {/* Price */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">💲 Prices</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="price"
              value="low"
              checked={selectedPrice === "low"}
              onChange={() => setSelectedPrice("low")}
            />
            <span>Low to High</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="price"
              value="high"
              checked={selectedPrice === "high"}
              onChange={() => setSelectedPrice("high")}
            />
            <span>High to Low</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="price"
              value="none"
              checked={selectedPrice === null}
              onChange={() => setSelectedPrice(null)}
            />
            <span>Clear Price Filter</span>
          </label>
        </div>
      </div>

      {/* Brands */}
      <BrandFilter onFilterChange={(ids) => setSelectedBrandIds(ids)} />

      {/* Categories */}
      <CategoryFilter
        onSelect={(ids) => setSelectedCategoryIds(ids)}
        selectedCategoryIds={selectedCategoryIds}
      />

      {/* SubCategories */}
      {selectedCategoryIds.length > 0 && (
        <SubCategoryFilter
          selectedCategoryIds={selectedCategoryIds}
          onSelect={(ids) => setSelectedSubCategoryIds(ids)}
        />
      )}
    </aside>
  );
};

export default Sidebar;
