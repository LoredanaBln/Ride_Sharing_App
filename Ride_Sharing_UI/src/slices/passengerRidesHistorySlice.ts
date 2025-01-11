import {Ride} from "../types/ride.ts";
import {createSlice} from "@reduxjs/toolkit";
import {fetchPassengerRides} from "../api/passengerGetOrders.ts";

interface RideState {
    rides: Ride[];
    loading: boolean;
    error: string | null;
}

const initialState: RideState = {
    rides: [],
    loading: false,
    error: null,
};

const ridesSlice = createSlice({
    name: 'rides',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPassengerRides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPassengerRides.fulfilled, (state, action) => {
                state.loading = false;
                state.rides = action.payload as Ride[];
            })
            .addCase(fetchPassengerRides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rides';
            });
    },
});

export default ridesSlice.reducer;

