import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DriverSignUpData } from '../types/signUpData/DriverSignUpData';
import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const signUpDriver = createAsyncThunk(
  'driver/signUp',
  async (driverData: DriverSignUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SIGN_UP_DRIVER, driverData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to sign up');
      }
    }
  }
);
