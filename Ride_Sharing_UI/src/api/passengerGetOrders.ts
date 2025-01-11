import { createAsyncThunk } from "@reduxjs/toolkit";
import { Ride } from "../types/ride.ts";
import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const fetchPassengerRides = createAsyncThunk(
  "rides/fetchPassengerRides",
  async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PASSENGER_GET_ORDERS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }
      return (await response.json()) as Ride[];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Rides retrieval failed");
    }
  }
);
