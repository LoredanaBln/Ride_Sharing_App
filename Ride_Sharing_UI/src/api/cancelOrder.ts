import { API_ENDPOINTS } from './apiEndpoints';
import { Order } from '../types/order';

export const cancelOrder = async (orderId: number, reason: string): Promise<Order> => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.CANCEL_ORDER}${orderId}/cancel?reason=${encodeURIComponent(reason)}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to cancel order: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw error instanceof Error
            ? error
            : new Error('An error occurred while canceling the order');
    }
};