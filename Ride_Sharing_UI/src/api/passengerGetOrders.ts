import { createAsyncThunk } from "@reduxjs/toolkit";
import { Ride } from "../types/ride";
import { API_ENDPOINTS } from "./apiEndpoints";

export const fetchPassengerRides = createAsyncThunk(
  "rides/fetchPassengerRides",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(API_ENDPOINTS.PASSENGER_GET_ORDERS, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token.replace('Bearer ', '')}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to fetch rides: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received rides data:', data);
      return data as Ride[];
    } catch (error) {
      console.error('Error fetching rides:', error);
      throw error;
    }
  }
);
