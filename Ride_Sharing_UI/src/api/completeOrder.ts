import { API_ENDPOINTS } from './apiEndpoints';

export const completeOrder = async (orderId: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.COMPLETE_ORDER}${orderId}/complete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to complete order: ${errorText}`);
    }
};