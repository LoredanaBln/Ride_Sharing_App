import { API_ENDPOINTS } from './apiEndpoints';
import { Order } from '../types/order';

export const completeOrder = async (orderId: number): Promise<Order> => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.COMPLETE_ORDER}${orderId}/complete`,
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
            throw new Error(`Failed to complete order: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw error instanceof Error
            ? error
            : new Error('An error occurred while completing the order');
    }
};