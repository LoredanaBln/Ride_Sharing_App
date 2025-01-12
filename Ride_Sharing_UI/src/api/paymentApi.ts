import { API_ENDPOINTS } from "./apiEndpoints.ts";
import { PaymentMethod } from "../types/PaymentMethod";

export const setupStripeCustomer = async (passengerId: number) => {
    const response = await fetch(`${API_ENDPOINTS.SETUP_STRIPE_CUSTOMER}/${passengerId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to setup stripe customer');
    }

    return response.text(); // Returns customerId
};

export const attachPaymentMethod = async (paymentMethodId: string, customerId: string) => {
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

export const deletePaymentMethod = async (paymentMethodId: string) => {
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
        isDefault: method.isDefault === 'true' // Parse the string to boolean
    }));
};

let cachedCustomerId: { [key: number]: string } = {};

export const getOrCreateStripeCustomer = async (passengerId: number) => {
    if (cachedCustomerId[passengerId]) {
        return cachedCustomerId[passengerId];
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_ENDPOINTS.GET_OR_CREATE_CUSTOMER}/${passengerId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
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

export const setDefaultPaymentMethod = async (paymentMethodId: string, customerId: string) => {
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