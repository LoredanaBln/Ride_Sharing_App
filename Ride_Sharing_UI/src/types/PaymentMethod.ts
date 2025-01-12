export interface PaymentMethod {
    id: string;
    type: string;
    lastFourDigits: string;
    expiryDate: string;
    isDefault: boolean;
    issuer?: string;
}