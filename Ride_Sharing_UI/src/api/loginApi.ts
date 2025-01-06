import { createAsyncThunk } from "@reduxjs/toolkit";

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
            const response = await fetch('http://localhost:8080/auth/login', {
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

            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);

            return { token, role };
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Login error:', err);
                return rejectWithValue(err.message || 'Login failed');
            }
            return rejectWithValue('Login failed');
        }
    }
);