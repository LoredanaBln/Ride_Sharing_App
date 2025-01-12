import { API_ENDPOINTS } from "../apiEndpoints";

export const deletePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.DELETE_PAYMENT_METHOD}/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete payment method');
    }
}; 