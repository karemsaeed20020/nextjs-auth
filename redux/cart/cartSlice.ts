import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: number[]; 
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    setCartItems: (state, action: PayloadAction<number[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
