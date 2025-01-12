import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const updatePassenger = async (passengerData: Record<string, unknown>): Promise<unknown> => {
    if (!passengerData) {
        throw new Error("No passenger data provided");
    }

    const response = await fetch(API_ENDPOINTS.PASSENGER_UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passengerData),
    });

    if (!response.ok) {
        throw new Error("Failed to update passenger details");
    }

    return response.json();
};