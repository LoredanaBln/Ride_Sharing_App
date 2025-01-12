import { API_ENDPOINTS } from "../../apiEndpoints";
import { BankAccount } from "../../../types/BankAccount";

export const getBankAccounts = async (connectAccountId: string): Promise<BankAccount[]> => {
    const response = await fetch(`${API_ENDPOINTS.GET_BANK_ACCOUNTS}/${connectAccountId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
    }

    return response.json();
}; 