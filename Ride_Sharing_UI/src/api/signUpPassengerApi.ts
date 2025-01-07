import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PassengerSignUpData } from '../types/signUpData/PassengerSignUpData';
import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const signUpPassenger = createAsyncThunk(
    'passenger/signUp',
    async (passengerData: PassengerSignUpData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_ENDPOINTS.SIGN_UP_PASSENGER,passengerData);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'Failed to sign up');
            }
        }
    }
);
