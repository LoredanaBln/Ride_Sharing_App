import { API_ENDPOINTS } from "../../apiEndpoints.ts";

export const setupStripeCustomer = async (passengerId: number): Promise<string> => {
    const response = await fetch(`${API_ENDPOINTS.SETUP_STRIPE_CUSTOMER}/${passengerId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to setup stripe customer');
    }

    return response.text();
}; 