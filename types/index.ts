export interface Brand {
  id: number;
  name: string;
}

export interface BrandFilterProps {
  onFilterChange: (brandIds: number[]) => void;
}


export interface Category {
  id: number;
  name: string;
}

export interface Props {
  onSelect: (selectedIds: number[]) => void;
}

export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Props {
  selectedCategoryIds: number[];
  onSelect: (ids: number[]) => void;
}

export interface Product {
  id: number;
  name?: string;
  name_en?: string;
  price?: number | string;
  image?: string;
  rate_avg?: number | string;
   hasOffer?: boolean;
  offer_title?: string;
}

export interface Filters {
  rating: number | null;
  price: string | null;
  categoryIds: number[];
  brandIds: number[];
  subCategoryIds: number[];
}
