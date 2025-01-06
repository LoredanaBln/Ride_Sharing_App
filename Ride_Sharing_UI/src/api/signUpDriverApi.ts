import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DriverSignUpData } from '../types/signUpData/DriverSignUpData';

export const signUpDriver = createAsyncThunk(
  'driver/signUp',
  async (driverData: DriverSignUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/driver/signUp', driverData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to sign up');
      }
    }
  }
);
