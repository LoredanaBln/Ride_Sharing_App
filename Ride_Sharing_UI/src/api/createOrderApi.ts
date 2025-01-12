import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_ENDPOINTS} from "./apiEndpoints.ts";
import {Order} from "../types/order.ts";

export const createOrderApi = createAsyncThunk(
    'order/create',
    async (order: Order, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(API_ENDPOINTS.CREATE_ORDER, order, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'Failed to sign up');
            }
        }
    }
);
