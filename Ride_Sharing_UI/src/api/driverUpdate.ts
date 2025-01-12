import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const updateDriver = async (driverData: Record<string, unknown>): Promise<unknown> => {
    if (!driverData) {
        throw new Error("No driver data provided");
    }

    const response = await fetch(API_ENDPOINTS.DRIVER_UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
    });

    if (!response.ok) {
        throw new Error("Failed to update driver details");
    }

    return response.json();
};
