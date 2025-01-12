import { API_ENDPOINTS } from "../apiEndpoints";

const cachedCustomerId: { [key: number]: string } = {};

export const getOrCreateStripeCustomer = async (passengerId: number): Promise<string> => {
    if (cachedCustomerId[passengerId]) {
        return cachedCustomerId[passengerId];
    }

    const response = await fetch(`${API_ENDPOINTS.GET_OR_CREATE_CUSTOMER}/${passengerId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get or create stripe customer');
    }

    const customerId = await response.text();
    cachedCustomerId[passengerId] = customerId;
    return customerId;
}; 