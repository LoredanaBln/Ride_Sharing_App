import { API_ENDPOINTS } from "../apiEndpoints";
import { PaymentMethod } from "../../types/PaymentMethod";

export const getPaymentMethods = async (customerId: string): Promise<PaymentMethod[]> => {
    const response = await fetch(`${API_ENDPOINTS.GET_PAYMENT_METHODS}/${customerId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
    }

    const data = await response.json();
    return data.map((method: any) => ({
        ...method,
        isDefault: method.isDefault === 'true'
    }));
}; 