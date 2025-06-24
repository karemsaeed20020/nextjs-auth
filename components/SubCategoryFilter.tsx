'use client';

import { useEffect, useState, useCallback } from "react"; 
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Props, SubCategory } from "@/types";
import axiosInstance from "@/lib/axios";

const SubCategoryFilter: React.FC<Props> = ({
  selectedCategoryIds,
  onSelect,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (!token || selectedCategoryIds.length === 0) {
      setSubCategories([]);
      setSelectedSubs([]); 
      onSelect([]); 
      setLoading(false);
      return;
    }

    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          skip: 0,
          take: 50,
          
          'filter[category_id]': selectedCategoryIds.join(',') 
        };

        const res = await axiosInstance.get(
          "api/sub-categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "X-Language": "ar", 
            },
            params,
          }
        );

        setSubCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching subcategories", error);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [token, selectedCategoryIds, onSelect]); 

  useEffect(() => {
    onSelect(selectedSubs);
  }, [selectedSubs, onSelect]);


  const handleChange = useCallback((id: number) => {
    setSelectedSubs((prev) =>
      prev.includes(id)
        ? prev.filter((subId) => subId !== id)
        : [...prev, id]
    );
  }, []); 

  const visibleSubs = showAll ? subCategories : subCategories.slice(0, 10);

  if (selectedCategoryIds.length === 0) {
    return null; 
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Subcategories</h4>

      {loading ? (
        <p className="text-sm text-gray-400 italic">Loading subcategories...</p>
      ) : visibleSubs.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No subcategories for selected categories.</p>
      ) : (
        <div className="space-y-2 text-sm text-gray-700 max-h-64 overflow-y-auto pr-1">
          {visibleSubs.map((sub) => (
            <label key={sub.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSubs.includes(sub.id)}
                onChange={() => handleChange(sub.id)}
              />
              <span>{sub.name}</span>
            </label>
          ))}
        </div>
      )}

      {subCategories.length > 10 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-blue-500 text-sm mt-2 hover:underline"
        >
          {showAll ? "Show less" : "+ More subcategories"}
        </button>
      )}
    </div>
  );
};

export default SubCategoryFilter;