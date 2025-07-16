import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnreadState {
  unreadCount: number;
}

const initialState: UnreadState = {
  unreadCount: 0,
};

const unreadCountSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, resetUnreadCount } = unreadCountSlice.actions;
export default unreadCountSlice.reducer;
