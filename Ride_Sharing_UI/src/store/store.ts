import { configureStore } from '@reduxjs/toolkit';
import  signUpDriverReducer  from '../slices/signUpDriverSlice';
import  signUpPassengerReducer  from '../slices/signUpPassengerSlice';

export const store = configureStore({
    reducer: {
        driverSignUp: signUpDriverReducer,
        passengerSignUp: signUpPassengerReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;