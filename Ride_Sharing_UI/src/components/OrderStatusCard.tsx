import React, { useState } from 'react';
import { OrderNotification } from '../types/OrderNotification';
import '../styles/orderStatusCard.css';

interface OrderStatusCardProps {
    notification: OrderNotification;
    onClose: () => void;
    onRateDriver?: (rating: number) => Promise<void>;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ notification, onClose, onRateDriver }) => {
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!notification.driverInfo) return null;

    console.log('Order status:', notification.status);
    
    const isRideActive = notification.status === 'ACCEPTED' || notification.status === 'IN_PROGRESS';
    const isRideCompleted = notification.status === 'COMPLETED';
    const isRideCanceled = notification.status === 'CANCELED';

    const handleRateDriver = async () => {
        if (onRateDriver && rating > 0) {
            setIsSubmitting(true);
            try {
                await onRateDriver(rating);
                onClose();
            } catch (error) {
                console.error('Error rating driver:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderStarRating = () => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'selected' : ''}`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="order-status-card">
            <div style={{ display: 'none' }}>
                Status: {notification.status}<br />
                Is Completed: {isRideCompleted.toString()}<br />
                Is Active: {isRideActive.toString()}
            </div>

            {isRideCompleted ? (
                <div className="ride-completed">
                    <h3>Ride Completed</h3>
                    <div className="driver-rating">
                        <p>Rate your experience with {notification.driverInfo.name}</p>
                        {renderStarRating()}
                        <button 
                            className="submit-rating-button"
                            onClick={handleRateDriver}
                            disabled={rating === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                        <button className="skip-rating-button" onClick={onClose}>
                            Skip
                        </button>
                    </div>
                </div>
            ) : isRideCanceled ? (
                <div className="ride-canceled">
                    <h3>Your ride has been canceled</h3>
                    <p className="cancellation-reason">
                        <span className="reason-label">Reason: </span>
                        <span className="reason-text">{notification.message.split(': ')[1]}</span>
                    </p>
                    <button className="close-button" onClick={onClose}>
                        CLOSE
                    </button>
                </div>
            ) : (
                <>
                    <h3>{notification.message}</h3>
                    <div className="driver-info">
                        <h4>Your driver</h4>
                        <p className="driver-name">{notification.driverInfo.name}</p>
                        <div className="car-info">
                            <p>{notification.driverInfo.carType} • {notification.driverInfo.carColor}</p>
                        </div>
                        <div className="rating">
                            <span className="stars">{'★'.repeat(Math.round(notification.driverInfo.rating))}</span>
                            <span className="rating-number">({notification.driverInfo.rating.toFixed(1)})</span>
                        </div>
                    </div>
                    {notification.estimatedArrival && (
                        <div className="eta">
                            <p>Estimated arrival: {notification.estimatedArrival} minutes</p>
                        </div>
                    )}
                    <div className="contact">
                        <p>Driver's phone: {notification.driverInfo.phoneNumber}</p>
                    </div>
                    {isRideActive && (
                        <div className="ride-status">
                            <p>Ride in progress</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderStatusCard; 