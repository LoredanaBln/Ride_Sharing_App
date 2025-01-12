import { API_ENDPOINTS } from "../../apiEndpoints";

export const getOrCreateStripeConnectAccount = async (driverId: number): Promise<string> => {
    const token = localStorage.getItem('token');
    console.log('Sending request with token:', token);
    
    const response = await fetch(`${API_ENDPOINTS.SETUP_STRIPE_CONNECT}/${driverId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Response status:', response.status);
        console.error('Response text:', errorText);
        throw new Error(errorText || 'Failed to setup stripe connect account');
    }

    return response.text();
}; 