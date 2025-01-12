import { PaymentMethod } from '@stripe/stripe-js';
import axios from 'axios';

export const getDefaultPaymentMethod = async (passengerId: number): Promise<PaymentMethod | null> => {
    const response = await axios.get(`/payment/defaultMethod/${passengerId}`);
    return response.data as PaymentMethod;
};