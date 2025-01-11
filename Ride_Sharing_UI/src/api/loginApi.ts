import { createAsyncThunk } from "@reduxjs/toolkit";
import {API_ENDPOINTS} from "./apiEndpoints.ts";

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (err: unknown) {
        if (err instanceof Error) {
            return err.message;
        }
        return 'Login failed';
    }
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const token = await response.text();
            const decodedToken = parseJwt(token);

            if (!decodedToken) {
                throw new Error('Invalid token');
            }
            const role = decodedToken.role || decodedToken.authorities;

            const userEmail = decodedToken.sub;

            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', userEmail);

            return { token, role, userEmail };
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Login error:', err);
                return rejectWithValue(err.message || 'Login failed');
            }
            return rejectWithValue('Login failed');
        }
    }
);