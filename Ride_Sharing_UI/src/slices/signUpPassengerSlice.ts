import { createSlice} from '@reduxjs/toolkit';
import { signUpPassenger } from '../api/signUpPassengerApi';

interface SignUpPassengerState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SignUpPassengerState = {
    loading: false,
    error: null,
    success: false,
};


const signUpPassengerSlice = createSlice({
    name: 'passengerSignUp',
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
            .addCase(signUpPassenger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpPassenger.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(signUpPassenger.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSignUpState } = signUpPassengerSlice.actions;
export default signUpPassengerSlice.reducer;