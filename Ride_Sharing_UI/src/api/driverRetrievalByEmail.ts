import {API_ENDPOINTS} from "./apiEndpoints.ts";
import {Driver} from "../types/driver.ts";

export const fetchDriverByEmail = async (email: string): Promise<Driver> => {
    if (!email) {
        throw new Error("No email provided");
    }

    const response = await fetch(`${API_ENDPOINTS.DRIVER_GET_BY_EMAIL}${email}`);
    if (!response.ok) {
        throw new Error("Failed to fetch passenger details");
    }

    return response.json();
};
