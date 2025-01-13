import React from 'react';
import { OrderNotification } from '../types/OrderNotification';
import '../styles/orderStatusCard.css';

interface OrderStatusCardProps {
    notification: OrderNotification;
    onClose: () => void;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ notification, onClose }) => {
    if (!notification.driverInfo) return null;

    const isRideActive = notification.status === 'ACCEPTED' || notification.status === 'IN_PROGRESS';

    return (
        <div className="order-status-card">
            {!isRideActive && (
                <button className="close-button" onClick={onClose}>×</button>
            )}
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
        </div>
    );
};

export default OrderStatusCard; 