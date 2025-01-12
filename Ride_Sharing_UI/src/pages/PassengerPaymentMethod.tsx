import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import '../styles/passengerPayment.css';
import backIcon from '../images/backGreen.png';
import cardIcon from '../images/credit-card.png';
import deleteIcon from '../images/delete.png';
import { loadStripe } from '@stripe/stripe-js';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import {
    attachPaymentMethod,
    deletePaymentMethod,
    getPaymentMethods,
    getOrCreateStripeCustomer,
    setDefaultPaymentMethod
} from '../api/payment';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '../config/stripe.ts';
import { PaymentMethod } from '../types/PaymentMethod';
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey); // Replace with your Stripe publishable key



interface AddCardFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    onPaymentMethodAdded: (passengerId: number) => Promise<void>;
}

function AddCardForm({ onSuccess, onCancel, onPaymentMethodAdded }: AddCardFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const userEmail = useSelector((state: RootState) => state.auth.userEmail);
    const [passenger, setPassenger] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.PASSENGER_GET_BY_EMAIL}${userEmail}`);
                if (!response.ok) throw new Error('Failed to fetch passenger');
                const data = await response.json();
                setPassenger(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch passenger');
            }
        };
        
        if (userEmail) {
            fetchPassenger();
        }
    }, [userEmail]);

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
        options: {
            supportedCountries: ['US', 'GB', 'AU', 'CA', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH'],
            allowedCardNetworks: ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb'],
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !passenger) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        try {
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: userEmail,
                    address: {
                        country: 'US',
                        postal_code: '12345'
                    }
                }
            });

            if (stripeError) {
                console.error('Stripe error:', stripeError);
                setError(stripeError.message || 'Failed to create payment method');
                return;
            }

            if (!paymentMethod) {
                setError('Failed to create payment method');
                return;
            }

            const customerId = await getOrCreateStripeCustomer(passenger.id);
            await attachPaymentMethod(paymentMethod.id, customerId);
            await onPaymentMethodAdded(passenger.id);
            onSuccess();
        } catch (err) {
            console.error('Card error:', err);
            setError(err instanceof Error ? err.message : 'Failed to add card');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement options={cardElementOptions} />
            {error && <div className="error-message">{error}</div>}
            <div className="form-buttons">
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">Add Card</button>
            </div>
        </form>
    );
}

function PassengerPaymentMethod() {
    const navigate = useNavigate();
    const [showAddCard, setShowAddCard] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passenger, setPassenger] = useState<any>(null);
    const userEmail = useSelector((state: RootState) => state.auth.userEmail);
    const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.PASSENGER_GET_BY_EMAIL}${userEmail}`);
                if (!response.ok) throw new Error('Failed to fetch passenger');
                const data = await response.json();
                setPassenger(data);
                fetchPaymentMethods(data.id);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch passenger');
            }
        };
        
        if (userEmail) {
            fetchPassenger();
        }
    }, [userEmail]);

    const fetchPaymentMethods = async (passengerId: number) => {
        try {
            setLoading(true);
            const customerId = await getOrCreateStripeCustomer(passengerId);
            const methods = await getPaymentMethods(customerId);
            setPaymentMethods(methods);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: string) => {
        try {
            setLoadingCards(prev => ({ ...prev, [id]: true }));
            await deletePaymentMethod(id);
            // Update the list locally instead of refetching
            setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete card');
        } finally {
            setLoadingCards(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleSetDefaultCard = async (id: string) => {
        try {
            setLoadingCards(prev => ({ ...prev, [id]: true }));
            const customerId = await getOrCreateStripeCustomer(passenger.id);
            await setDefaultPaymentMethod(id, customerId);
            
            // Update only the isDefault status locally instead of refetching all cards
            setPaymentMethods(prevMethods => 
                prevMethods.map(method => ({
                    ...method,
                    isDefault: method.id === id
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set default card');
        } finally {
            setLoadingCards(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="payment-method-container">
            <button className="back-button" onClick={() => navigate('/passenger-home')}>
                <img src={backIcon as string} alt="back" />
            </button>

            <div className="payment-content">
                <h1>Payment Methods</h1>

                <div className="payment-methods-list">
                    {paymentMethods.map(method => (
                        <div key={method.id} 
                             className={`payment-method-card ${method.isDefault ? 'default-card' : ''}`}>
                            <div className="card-info">
                                <img src={cardIcon as string} alt="card" className="card-icon" />
                                <div className="card-details">
                                    <p className="card-type">
                                        {method.type}
                                        {method.issuer && ` • ${method.issuer}`}
                                        {method.isDefault && <span className="default-badge">Default</span>}
                                    </p>
                                    <p className="card-number">**** **** **** {method.lastFourDigits}</p>
                                    <p className="expiry">Expires: {method.expiryDate}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                {!method.isDefault && (
                                    <button 
                                        className="action-button set-default"
                                        onClick={() => handleSetDefaultCard(method.id)}
                                        disabled={loadingCards[method.id]}
                                    >
                                        {loadingCards[method.id] ? (
                                            <span className="button-spinner"></span>
                                        ) : (
                                            'Set Default'
                                        )}
                                    </button>
                                )}
                                <button 
                                    className="action-button delete"
                                    onClick={() => handleDeleteCard(method.id)}
                                    disabled={loadingCards[method.id]}
                                >
                                    {loadingCards[method.id] ? (
                                        <span className="button-spinner"></span>
                                    ) : (
                                        <img src={deleteIcon as string} alt="delete" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!showAddCard ? (
                    <button 
                        className="add-card-button"
                        onClick={() => setShowAddCard(true)}
                    >
                        Add New Card
                    </button>
                ) : (
                    <Elements stripe={stripePromise}>
                        <AddCardForm 
                            onSuccess={() => setShowAddCard(false)} 
                            onCancel={() => setShowAddCard(false)}
                            onPaymentMethodAdded={fetchPaymentMethods}
                        />
                    </Elements>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
}

export default PassengerPaymentMethod;
