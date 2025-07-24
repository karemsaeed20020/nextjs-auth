
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image?: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  user: User | null;
  phone: string | null;
  code: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  token: null,
  user: null,
  phone: null,
  code: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    
    registerStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    registerSuccess(
      state, 
      action: PayloadAction<{ 
        token: string; 
        user: User 
      }>
    ) {
      state.loading = false;
      state.success = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    loginStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    loginSuccess(
      state, 
      action: PayloadAction<{
        token: string;
        user: User
      }>
    ) {
      state.loading = false;
      state.success = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.token = null;
      state.user = null;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.success = false;
      state.loading = false;
      state.phone = null;
      state.code = null;
      state.error = null;
    },

    setForgotPasswordPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setPhoneAndCode(state, action: PayloadAction<{ phone: string; code: string }>) {
      state.phone = action.payload.phone;
      state.code = action.payload.code;
    },
    clearPhoneAndCode(state) {
      state.phone = null;
      state.code = null;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    updateUserProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    refreshToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    }
  },
});

export const {
  setLoading,
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setForgotPasswordPhone,
  setPhoneAndCode,
  clearPhoneAndCode,
  setError,
  updateUserProfile,
  refreshToken
} = authSlice.actions;

export default authSlice.reducer;
