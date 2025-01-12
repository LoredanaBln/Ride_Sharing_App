import { API_ENDPOINTS } from "../../apiEndpoints";

export const setDefaultBankAccount = async (bankAccountId: string, connectAccountId: string): Promise<void> => {
    const response = await fetch(
        `${API_ENDPOINTS.SET_DEFAULT_BANK_ACCOUNT}/${bankAccountId}/setDefault?connectAccountId=${connectAccountId}`, 
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to set default bank account');
    }
}; 