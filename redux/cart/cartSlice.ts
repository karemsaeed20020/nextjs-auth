
import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  valid_until: string;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  loading: boolean;
  error: string | null;
  vatRatio: string;
}

const initialState: CartState = {
  items: [],
  coupon: null,
  loading: false,
  error: null,
  vatRatio: '0'
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setCart(state, action: PayloadAction<{
      items: CartItem[];
      vatRatio?: string;
      coupon?: Coupon | null;
    }>) {
      state.items = action.payload.items;
      if (action.payload.vatRatio) {
        state.vatRatio = action.payload.vatRatio;
      }
      if (action.payload.coupon !== undefined) {
        state.coupon = action.payload.coupon;
      }
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateCartItem(state, action: PayloadAction<{id: number; quantity: number}>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity > 0 ? action.payload.quantity : 1;
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  setCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
