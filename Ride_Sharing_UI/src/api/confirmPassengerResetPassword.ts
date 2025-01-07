import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const confirmPasswordReset = async (
    token: string,
    newPassword: string
): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.PASSENGER_CONFIRM_RESET_PASSWORD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token, newPassword}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
    }
};