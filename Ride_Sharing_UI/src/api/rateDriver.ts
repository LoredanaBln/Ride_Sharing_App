import { API_ENDPOINTS } from './apiEndpoints';

export const rateDriver = async (orderId: number, rating: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.RATE_DRIVER}/${orderId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit rating: ${errorText}`);
    }
}; 