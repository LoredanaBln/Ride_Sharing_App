import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import '../styles/driverPayment.css';
import backIcon from '../images/backGreen.png';
import bankIcon from '../images/bank.png';
import deleteIcon from '../images/delete.png';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import {
    attachBankAccount,
    deleteBankAccount,
    getBankAccounts,
    getOrCreateStripeConnectAccount,
    setDefaultBankAccount
} from '../api/payment/driver/index';
import { BankAccount } from '../types/BankAccount';
import { Driver } from '../types/driver';
import { API_ENDPOINTS } from '../api/apiEndpoints';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface AddBankFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    onBankAccountAdded: (driverId: number) => Promise<void>;
    connectAccountId: string;
}

function AddBankForm({ onSuccess, onCancel, onBankAccountAdded, connectAccountId }: AddBankFormProps) {
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await attachBankAccount(
                accountNumber,
                routingNumber,
                accountHolderName,
                connectAccountId
            );
            await onBankAccountAdded(connectAccountId);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add bank account');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-bank-form">
            <h2>Add Bank Account</h2>
            
            <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
            />
            
            <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
            />
            
            <input
                type="text"
                placeholder="Routing Number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                required
            />
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-buttons">
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">Add Bank Account</button>
            </div>
        </form>
    );
}

function DriverPaymentMethod() {
    const navigate = useNavigate();
    const [showAddBank, setShowAddBank] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [driver, setDriver] = useState<Driver | null>(null);
    const [connectAccountId, setConnectAccountId] = useState<string | null>(null);
    const userEmail = useSelector((state: RootState) => state.auth.userEmail);
    const [loadingAccounts, setLoadingAccounts] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.DRIVER_GET_BY_EMAIL}${userEmail}`);
                if (!response.ok) throw new Error('Failed to fetch driver');
                const data = await response.json();
                setDriver(data);
                
                console.log('Fetching connect account for driver:', data.id);
                const accountId = await getOrCreateStripeConnectAccount(data.id);
                console.log('Retrieved connect account ID:', accountId);
                
                setConnectAccountId(accountId);
                if (accountId) {
                    await fetchBankAccounts(accountId);
                }
            } catch (err) {
                console.error('Error in fetchDriver:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch driver');
            }
        };
        
        if (userEmail) {
            fetchDriver();
        }
    }, [userEmail]);

    const fetchBankAccounts = async (accountId: string) => {
        try {
            setLoading(true);
            const accounts = await getBankAccounts(accountId);
            setBankAccounts(accounts);
        } catch (err) {
            console.error('Error fetching bank accounts:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch bank accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBank = async (id: string) => {
        if (!connectAccountId) {
            setError('No connect account ID available');
            return;
        }

        try {
            console.log('Deleting bank account:', {
                bankAccountId: id,
                connectAccountId: connectAccountId
            });
            
            setLoadingAccounts(prev => ({ ...prev, [id]: true }));
            await deleteBankAccount(id, connectAccountId);
            
            console.log('Successfully deleted bank account');
            
            // Refresh the bank accounts list after successful deletion
            if (connectAccountId) {
                await fetchBankAccounts(connectAccountId);
            }
        } catch (err) {
            console.error('Error deleting bank account:', err);
            // Show a more user-friendly error message
            if (err instanceof Error && err.message.includes('default')) {
                setError('Cannot delete your default bank account. Please add another bank account first.');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to delete bank account');
            }
        } finally {
            setLoadingAccounts(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="payment-method-container">
            <button className="back-button" onClick={() => navigate('/driver-home')}>
                <img src={backIcon as string} alt="back" />
            </button>

            <div className="payment-content">
                <h1>Payment Methods</h1>
                
                <div className="payment-methods-list">
                    {bankAccounts.map(account => (
                        <div 
                            key={account.id} 
                            className={`bank-account-card ${account.isDefault ? 'default-account' : ''}`}
                        >
                            <div className="account-info">
                                <img src={bankIcon as string} alt="bank" className="bank-icon" />
                                <div className="account-details">
                                    <div className="account-holder-wrapper">
                                        <p className="account-holder">{account.accountHolderName}</p>
                                        {account.isDefault && (
                                            <span className="default-badge">Default</span>
                                        )}
                                    </div>
                                    <p className="account-number">**** **** **** {account.accountNumber.slice(-4)}</p>
                                    {account.bankName && <p className="bank-name">{account.bankName}</p>}
                                </div>
                            </div>
                            <div className="account-actions">
                                <button 
                                    className="action-button delete"
                                    onClick={() => handleDeleteBank(account.id)}
                                    disabled={loadingAccounts[account.id]}
                                >
                                    {loadingAccounts[account.id] ? (
                                        <span className="button-spinner"></span>
                                    ) : (
                                        <img src={deleteIcon as string} alt="delete" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!showAddBank ? (
                    <button 
                        className="add-bank-button"
                        onClick={() => setShowAddBank(true)}
                    >
                        Add Bank Account
                    </button>
                ) : (
                    <Elements stripe={stripePromise}>
                        <AddBankForm 
                            onSuccess={() => setShowAddBank(false)}
                            onCancel={() => setShowAddBank(false)}
                            onBankAccountAdded={fetchBankAccounts}
                            connectAccountId={connectAccountId || ''}
                        />
                    </Elements>
                )}
            </div>
            
            {error && (
                <div className="error-message" style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#ff5252',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}>
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        style={{
                            marginLeft: '12px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
}

export default DriverPaymentMethod; 