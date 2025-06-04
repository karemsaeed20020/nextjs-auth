import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  phone: string | null;
  code: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  token: null,
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
    registerSuccess(state, action: PayloadAction<{ token: string; phone: string }>) {
      state.loading = false;
      state.success = true;
      state.token = action.payload.token;
      state.phone = action.payload.phone; 
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
    loginSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.success = true;
      state.token = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.token = null;
    },
    logout(state) {
      state.token = null;
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
    }
  },
});

export const {
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
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;