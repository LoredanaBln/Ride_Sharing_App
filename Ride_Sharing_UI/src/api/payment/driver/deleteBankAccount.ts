import { API_ENDPOINTS } from '../../apiEndpoints';

export const deleteBankAccount = async (bankAccountId: string, connectAccountId: string): Promise<void> => {
    if (!bankAccountId || !connectAccountId) {
        throw new Error('Bank Account ID and Connect Account ID are required');
    }

    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_ENDPOINTS.DELETE_BANK_ACCOUNT}/${bankAccountId}?connectAccountId=${connectAccountId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete bank account error:', errorText);
        throw new Error(errorText || 'Failed to delete bank account');
    }
}; 