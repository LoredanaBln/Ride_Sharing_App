import React from 'react';
import '../styles/rideDetails.css';

interface RideDetailsProps {
    distance: number;
    duration: number;
    price: number;
    onCreateOrder: () => void;
    onClose: () => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ 
    distance, 
    duration, 
    price, 
    onCreateOrder, 
    onClose 
}) => {
    return (
        <div className="ride-details-card">
            <button className="close-button" onClick={onClose}>×</button>
            <h3>Ride Details</h3>
            <div className="details-content">
                <div className="detail-item">
                    <span className="label">Distance:</span>
                    <span className="value">{distance.toFixed(2)} km</span>
                </div>
                <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{Math.round(duration)} minutes</span>
                </div>
                <div className="detail-item">
                    <span className="label">Estimated Price:</span>
                    <span className="value">${price.toFixed(2)}</span>
                </div>
            </div>
            <button className="create-order-button" onClick={onCreateOrder}>
                Create Order
            </button>
        </div>
    );
};

export default RideDetails; 