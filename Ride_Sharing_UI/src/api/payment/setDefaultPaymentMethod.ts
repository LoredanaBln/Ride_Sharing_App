import { API_ENDPOINTS } from "../apiEndpoints";

export const setDefaultPaymentMethod = async (paymentMethodId: string, customerId: string): Promise<void> => {
    const response = await fetch(
        `${API_ENDPOINTS.SET_DEFAULT_PAYMENT_METHOD}/${paymentMethodId}/setDefault?customerId=${customerId}`, 
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to set default payment method');
    }
}; 