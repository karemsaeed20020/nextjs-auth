'use client';

import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Category, Props } from "@/types";
import axiosInstance from "@/lib/axios";
import { setLoading } from "@/redux/auth/authSlice";

const CategoryFilter = ({ onSelect }: Props) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const globalLoading = useSelector((state: RootState) => state.auth.loading);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(true));
    axiosInstance
      .get("api/categories", {
        headers: { Authorization: `Bearer ${token}` },
        params: { skip: 0, take: 100 },
      })
      .then((res) => setCategories(res.data.data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      })
      .finally(() => dispatch(setLoading(false)));
  }, [token, dispatch]);

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  const handleCheckboxChange = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
    );
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleCategories = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Categories</h4>

      <input
        type="text"
        placeholder="Search..."
        className="w-full px-3 py-2 text-sm border outline-none text-black rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-3 space-y-2 text-sm text-gray-700 max-h-64 overflow-y-auto pr-1">
        {globalLoading ? (
          <p className="text-gray-400 italic">Loading categories...</p>
        ) : visibleCategories.length === 0 ? (
          <p className="text-gray-400 italic">No categories found</p>
        ) : (
          visibleCategories.map((cat) => (
            <label key={cat.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(cat.id)}
                onChange={() => handleCheckboxChange(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))
        )}
      </div>

      {filtered.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-500 text-sm mt-2 hover:underline"
        >
          {showAll ? "Show less" : "+ More categories"}
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
