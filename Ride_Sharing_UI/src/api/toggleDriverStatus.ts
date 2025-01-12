import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const toggleDriverStatus = createAsyncThunk(
    "driver/toggleDriverStatus",
    async () => {
        try {
            const response = await fetch(API_ENDPOINTS.TOGGLE_ONLINE, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error toggling driver status: ${response.statusText}`);
            }

            const data = await response.json();

            return { status: data.status };
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("Driver status update failed");
        }
    }
);
