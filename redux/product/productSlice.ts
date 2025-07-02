import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface Rate {
  id: number;
  value: number;
  description: string;
  created_at: string;
  user_name: string;
  user_image: string;
}

interface RateDetail {
  value: number;
  count: number;
}

interface ProductState {
  rate_count: number;
  rate_avg: string;
  rates: Rate[];
  rate_details: RateDetail[];
  user_review: Rate | null;
}

const initialState: ProductState = {
  rate_count: 0,
  rate_avg: '0',
  rates: [],
  rate_details: [
    { value: 1, count: 0 },
    { value: 2, count: 0 },
    { value: 3, count: 0 },
    { value: 4, count: 0 },
    { value: 5, count: 0 },
  ],
  user_review: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductData: (
      state,
      action: PayloadAction<{
        rate_avg: string;
        rate_count: number;
        rates: Rate[];
        rate_details: RateDetail[];
        user_review: Rate | null;
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
      state.user_review = newRate;

      const detail = state.rate_details.find((d) => d.value === value);
      if (detail) detail.count += 1;
    },
    resetProduct: () => initialState,
  },
});

const persistConfig = {
  key: 'product',
  storage,
  whitelist: ['rate_avg', 'rate_count', 'rates', 'rate_details', 'user_review'],
};

export const { setProductData, addReview, resetProduct } = productSlice.actions;

export default persistReducer(persistConfig, productSlice.reducer);