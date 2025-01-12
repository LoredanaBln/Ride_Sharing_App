import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ride } from "../types/ride";
import { fetchPassengerRides } from "../api/passengerGetOrders";

interface RidesState {
  rides: Ride[];
  loading: boolean;
  error: string | null;
}

const initialState: RidesState = {
  rides: [],
  loading: false,
  error: null,
};

const ridesSlice = createSlice({
  name: "rides",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPassengerRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPassengerRides.fulfilled,
        (state, action: PayloadAction<Ride[]>) => {
          state.loading = false;
          state.rides = action.payload;
        }
      )
      .addCase(fetchPassengerRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch rides";
      });
  },
});

export default ridesSlice.reducer;

