export interface RegisterPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
}