export interface BankAccount {
    id: string;
    accountNumber: string;
    accountHolderName: string;
    bankName?: string;
    isDefault: boolean;
} 