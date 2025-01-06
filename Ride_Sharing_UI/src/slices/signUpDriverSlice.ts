import { createSlice} from '@reduxjs/toolkit';
import { signUpDriver } from '../api/signUpDriverApi';

interface SignUpDriverState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SignUpDriverState = {
  loading: false,
  error: null,
  success: false,
};


const signUpDriverSlice = createSlice({
  name: 'driverSignUp',
  initialState,
  reducers: {
    resetSignUpState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpDriver.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(signUpDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSignUpState } = signUpDriverSlice.actions;
export default signUpDriverSlice.reducer;