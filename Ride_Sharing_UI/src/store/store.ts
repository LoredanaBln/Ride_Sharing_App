import {configureStore} from '@reduxjs/toolkit';
import loginReducer from '../slices/loginSlice.ts'
import signUpDriverReducer from '../slices/signUpDriverSlice';
import signUpPassengerReducer from '../slices/signUpPassengerSlice';
import ridesReducer from '../slices/passengerRidesHistorySlice.ts'

export const store = configureStore({
    reducer: {
        auth: loginReducer,
        driverSignUp: signUpDriverReducer,
        passengerSignUp: signUpPassengerReducer,
        rides: ridesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch