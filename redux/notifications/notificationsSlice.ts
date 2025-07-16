import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: number;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, is_read: 1 }));
    },
  },
});

export const { setNotifications, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
