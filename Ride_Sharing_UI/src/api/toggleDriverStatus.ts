import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const toggleDriverStatus = createAsyncThunk(
    "driver/toggleDriverStatus",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(API_ENDPOINTS.TOGGLE_ONLINE, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Toggle status failed:", response.status, errorData);
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            return { status: data.status };
        } catch (err: unknown) {
            console.error("Toggle status error:", err);
            return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
        }
    }
);