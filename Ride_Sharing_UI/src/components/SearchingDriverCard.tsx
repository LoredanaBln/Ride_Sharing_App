import React from 'react';
import '../styles/searchingDriverCard.css';

interface SearchingDriverCardProps {
    onCancel: () => void;
}

const SearchingDriverCard: React.FC<SearchingDriverCardProps> = ({ onCancel }) => {
    return (
        <div className="searching-driver-card">
            <div className="loading-spinner"></div>
            <h3>Looking for a driver</h3>
            <p>Please wait while we find you a driver...</p>
            <button className="cancel-button" onClick={onCancel}>
                CANCEL
            </button>
        </div>
    );
};

export default SearchingDriverCard; 