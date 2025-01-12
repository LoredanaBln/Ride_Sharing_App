import {Ride} from "../types/ride.ts";
import {createSlice} from "@reduxjs/toolkit";
import {fetchDriverRides} from "../api/driverGetOrders.ts";

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
            .addCase(fetchDriverRides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDriverRides.fulfilled, (state, action) => {
                state.loading = false;
                state.rides = action.payload as Ride[];
            })
            .addCase(fetchDriverRides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rides';
            });
    },
});

export default ridesSlice.reducer;

