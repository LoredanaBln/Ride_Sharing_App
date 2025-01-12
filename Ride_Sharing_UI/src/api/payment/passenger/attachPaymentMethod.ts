import { API_ENDPOINTS } from "../../apiEndpoints.ts";

export const attachPaymentMethod = async (paymentMethodId: string, customerId: string): Promise<string> => {
    const response = await fetch(
        `${API_ENDPOINTS.ATTACH_PAYMENT_METHOD}?paymentMethodId=${paymentMethodId}&customerId=${customerId}`, 
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to attach payment method');
    }

    return response.text();
}; 