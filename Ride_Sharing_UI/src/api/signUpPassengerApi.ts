import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PassengerSignUpData } from '../types/signUpData/PassengerSignUpData';

export const signUpPassenger = createAsyncThunk(
    'passenger/signUp',
    async (passengerData: PassengerSignUpData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8080/passenger/signUp',passengerData);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'Failed to sign up');
            }
        }
    }
);
