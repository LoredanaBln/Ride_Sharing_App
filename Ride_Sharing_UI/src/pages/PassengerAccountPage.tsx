import { useNavigate, useLocation } from 'react-router-dom';
import {useEffect, useState} from 'react';
import '../styles/passengerAccount.css';
import avatarIcon from '../images/avatar.png';
import backIcon from '../images/backGreen.png';
import {updatePassenger} from "../api/passengerUpdate.ts";

function PassengerAccountPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const passenger = location.state?.passenger || null;

    const [isEditing, setIsEditing] = useState(false);

    const [originalPassengerData, setOriginalPassengerData] = useState(passenger);

    const [name, setName] = useState(passenger?.name || '');
    const [phone, setPhone] = useState(passenger?.phoneNumber || '');
    const [email, setEmail] = useState(passenger?.email || '');
    const rating = useState(passenger?.rating || '');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleSaveClick = async () => {
        if (!passenger) {
            console.error("Passenger data not found");
            return;
        }

        const updatedPassengerData = {
            ...passenger,
            name: name !== passenger.name ? name : passenger.name,
            phoneNumber: phone !== passenger.phoneNumber ? phone : passenger.phoneNumber,
            email: email !== passenger.email ? email : passenger.email,
        };

        try {
            await updatePassenger(updatedPassengerData);
            setIsEditing(false);
            alert("Passenger information updated successfully!");
        } catch (error) {
            console.error("Failed to update passenger:", error);
            alert("Failed to update passenger information.");
        }
    };

    const handleCancelClick = () => {
        if (originalPassengerData) {
            setName(originalPassengerData.name);
            setPhone(originalPassengerData.phoneNumber);
            setEmail(originalPassengerData.email);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (passenger) {
            setOriginalPassengerData(passenger);
        }
    }, [passenger]);

    return (
        <div className="account-container">
            <button className="back-button" onClick={() => navigate('/passenger-home')}>
                <img src={backIcon} alt="back"/>
            </button>

            <div className="profile-section">
                <div className="profile-picture">
                    <img src={avatarIcon} alt="Profile"/>
                </div>
                <div className="profile-info">
                    <h2>{name}</h2>
                    <div className="rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-value">{rating}</span>
                    </div>
                </div>
            </div>

            <div className="personal-data-section">
                <h3>Personal Information</h3>

                {[
                    {label: 'Name', value: name, onChange: handleNameChange},
                    {label: 'Phone', value: phone, onChange: handlePhoneChange},
                    {label: 'Email', value: email, onChange: handleEmailChange},
                ].map((field, index) => (
                    <div className="data-field" key={index}>
                        <div className="field-content">
                            <label>{field.label}</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="edit-input"
                                />
                            ) : (
                                <p>{field.value}</p>
                            )}
                        </div>
                    </div>
                ))}

                <div className="button-group">
                    {isEditing ? (
                        <>
                            <button className="save-button" onClick={handleSaveClick}>
                                Save All
                            </button>
                            <button className="cancel-edit-button" onClick={handleCancelClick}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button className="edit-button" onClick={() => setIsEditing(true)}>
                            Edit information
                        </button>
                    )}
                </div>
            </div>

            <div className="actions-section">
            <button className="change-password-button">Change Password</button>
                <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
            </div>

            {showDeleteConfirm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Delete Account</h3>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="popup-buttons">
                            <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="confirm-delete-button" onClick={() => setShowDeleteConfirm(false)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PassengerAccountPage;