export interface CartProduct {
  id: number;
  image: string;
  name: string;
  quantity: number;
  brand_name: string;
  price: string;
  offer_price: string;
}

export interface CartData {
  id: number;
  vat_ratio: string;
  coupon_id: number | null;
  coupon_type: string | null;
  coupon_value: string | null;
  products: CartProduct[];


}

// In your types.ts file
export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
  hasOffer?: boolean;
  offer_title?: string;
}
