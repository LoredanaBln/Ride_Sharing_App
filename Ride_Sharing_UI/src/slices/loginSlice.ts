import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/loginApi.ts";

interface LoginState {
  token: string | null;
  userEmail: string | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  token: localStorage.getItem("token"),
  userEmail: localStorage.getItem("userEmail"),
  role: localStorage.getItem("userRole"),
  isLoading: false,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userEmail = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userEmail = action.payload.userEmail;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials) => {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login response:', data); // Add this for debugging
        localStorage.setItem('token', data.token);
        return data;
    }
);
