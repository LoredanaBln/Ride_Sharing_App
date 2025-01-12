import { API_ENDPOINTS } from "../../apiEndpoints";

export const attachBankAccount = async (
    accountNumber: string,
    routingNumber: string,
    accountHolderName: string,
    connectAccountId: string
): Promise<string> => {
    const response = await fetch(`${API_ENDPOINTS.ATTACH_BANK_ACCOUNT}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accountNumber,
            routingNumber,
            accountHolderName,
            connectAccountId
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to attach bank account');
    }

    return response.text();
}; 