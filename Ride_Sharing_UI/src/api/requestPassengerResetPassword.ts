import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const requestPasswordReset = async (email: string): Promise<string> => {
    const response = await fetch(API_ENDPOINTS.PASSENGER_REQUEST_RESET_PASSWORD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request password reset");
    }

    return response.text();
};