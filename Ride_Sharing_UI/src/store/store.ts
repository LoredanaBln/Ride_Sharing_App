import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../slices/loginSlice';
import ridesReducer from '../slices/passengerRidesHistorySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rides: ridesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch