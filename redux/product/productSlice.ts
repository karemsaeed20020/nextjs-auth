import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface Rate {
  id: number;
  value: number;
  description: string;
  created_at: string;
  user_id: number;
  user_name: string;
  user_image: string;
}

interface RateDetail {
  value: number;
  count: number;
}

interface ProductState {
  productId: number | null;
  rate_count: number;
  rate_avg: string;
  rates: Rate[];
  rate_details: RateDetail[];
  is_rated: number;
}

const initialState: ProductState = {
  productId: null,
  rate_count: 0,
  rate_avg: '0.0',
  rates: [],
  rate_details: [
    { value: 1, count: 0 },
    { value: 2, count: 0 },
    { value: 3, count: 0 },
    { value: 4, count: 0 },
    { value: 5, count: 0 },
  ],
  is_rated: 0,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductData: (
      state,
      action: PayloadAction<{
        productId: number;
        rate_avg: string;
        rate_count: number;
        rates: Rate[];
        rate_details: RateDetail[];
        is_rated: number;
      }>
    ) => {
      return { ...state, ...action.payload };
    },

    addReview: (state, action: PayloadAction<Rate>) => {
      const newRate = action.payload;
      const value = newRate.value;

      const totalRating =
        parseFloat(state.rate_avg) * state.rate_count + value;
      const newCount = state.rate_count + 1;
      const newAvg = (totalRating / newCount).toFixed(1);

      state.rate_avg = newAvg;
      state.rate_count = newCount;
      state.rates = [newRate, ...state.rates];
      state.is_rated = 1;

      const detail = state.rate_details.find((d) => d.value === value);
      if (detail) detail.count += 1;
    },

    resetProduct: () => initialState,
  },
});

export const { setProductData, addReview, resetProduct } = productSlice.actions;

const persistConfig = {
  key: 'product',
  storage,
  whitelist: ['productId', 'rate_avg', 'rate_count', 'rates', 'rate_details', 'is_rated'],
};

export default persistReducer(persistConfig, productSlice.reducer);
