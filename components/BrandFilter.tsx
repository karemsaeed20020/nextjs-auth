"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axiosInstance from "@/lib/axios";
import { Brand, BrandFilterProps } from "@/types";

const BrandFilter = ({ onFilterChange }: BrandFilterProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchBrands = async () => {
      try {
        const res = await axiosInstance(
          "api/brands", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              skip: 0,
              take: 400,
            },
          }
        );
        setBrands(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      }
    };

    fetchBrands();
  }, [token]);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayBrands = showAll ? filtered : filtered.slice(0, 10);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, id] : prev.filter((brandId) => brandId !== id)
    );
  };

  useEffect(() => {
    onFilterChange(selectedBrands);
  }, [selectedBrands, onFilterChange]);

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Brands</h4>

      <input
        type="text"
        placeholder="Search brands..."
        className="w-full px-3 py-2 text-sm border outline-none text-black rounded-md focus:ring-2 focus:ring-blue-500 placeholder-black/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-3 space-y-2 text-sm text-gray-700 max-h-64 overflow-auto pr-1">
        {displayBrands.length === 0 ? (
          <p className="text-gray-400 italic">No brands found</p>
        ) : (
          displayBrands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={(e) => handleCheckboxChange(brand.id, e.target.checked)}
              />
              <span>{brand.name}</span>
            </label>
          ))
        )}
      </div>

      {filtered.length > 10 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-blue-500 text-sm mt-2 hover:underline"
        >
          {showAll ? "Show less" : "+ More brands"}
        </button>
      )}
    </div>
  );
};

export default BrandFilter;
