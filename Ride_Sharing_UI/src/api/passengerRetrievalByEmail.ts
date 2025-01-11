import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const fetchPassengerByEmail = async (email: string): Promise<unknown> => {
    if (!email) {
        throw new Error("No email provided");
    }

    const response = await fetch(`${API_ENDPOINTS.PASSENGER_GET_BY_EMAIL}${email}`);
    if (!response.ok) {
        throw new Error("Failed to fetch passenger details");
    }

    return response.json();
};
