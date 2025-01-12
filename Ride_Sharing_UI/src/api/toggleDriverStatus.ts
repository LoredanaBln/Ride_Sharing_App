import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const toggleDriverStatus = createAsyncThunk(
    "driver/toggleStatus",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            console.log('Token being sent:', token);
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            console.log('Headers being sent:', headers);

            const response = await fetch(API_ENDPOINTS.TOGGLE_ONLINE, {
                method: "PUT",
                headers,
                credentials: "include",
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Response headers:', Object.fromEntries([...response.headers]));
                console.log('Response status:', response.status);
                throw new Error(`Toggle status failed: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Toggle status failed:", error);
            return rejectWithValue(error instanceof Error ? error.message : "Failed to toggle status");
        }
    }
);