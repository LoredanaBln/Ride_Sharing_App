import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles/passengerAccount.css';
import avatarIcon from '../images/avatar.png';
import backIcon from '../images/backGreen.png';
import editIcon from '../images/edit.png';

function PassengerAccountPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const passenger = location.state?.passenger || null;
    
    // Edit states
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // Data states
    const [name, setName] = useState(passenger?.name);
    const [phone, setPhone] = useState(passenger?.phoneNumber);
    const [email, setEmail] = useState(passenger?.email);

    // Edit handlers
    const handleEditName = () => setIsEditingName(true);
    const handleEditPhone = () => setIsEditingPhone(true);
    const handleEditEmail = () => setIsEditingEmail(true);

    // Cancel handlers
    const handleCancelName = () => setIsEditingName(false);
    const handleCancelPhone = () => setIsEditingPhone(false);
    const handleCancelEmail = () => setIsEditingEmail(false);

    // Change handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    return (
        <div className="account-container">
            <button className="back-button" onClick={() => navigate('/passenger-home')}>
                <img src={backIcon} alt="back" />
            </button>

            <div className="profile-section">
                <div className="profile-picture">
                    <img src={avatarIcon} alt="Profile" />
                </div>
                <div className="profile-info">
                    <h2>{name}</h2>
                    <div className="rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-value">4.8</span>
                    </div>
                </div>
            </div>

            <div className="personal-data-section">
                <h3>Personal Information</h3>
                
                <div className="data-field">
                    <div className="field-content">
                        <label>Name</label>
                        {isEditingName ? (
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="edit-input"
                                autoFocus
                            />
                        ) : (
                            <p>{name}</p>
                        )}
                    </div>
                    <div className="button-group">
                        {isEditingName ? (
                            <>
                                <button className="cancel-edit-button" onClick={handleCancelName}>
                                    Cancel
                                </button>
                                <button className="save-button" onClick={() => setIsEditingName(false)}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <button className="edit-button" onClick={handleEditName}>
                                <img src={editIcon} alt="edit" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="data-field">
                    <div className="field-content">
                        <label>Phone</label>
                        {isEditingPhone ? (
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="edit-input"
                                autoFocus
                            />
                        ) : (
                            <p>{phone}</p>
                        )}
                    </div>
                    <div className="button-group">
                        {isEditingPhone ? (
                            <>
                                <button className="cancel-edit-button" onClick={handleCancelPhone}>
                                    Cancel
                                </button>
                                <button className="save-button" onClick={() => setIsEditingPhone(false)}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <button className="edit-button" onClick={handleEditPhone}>
                                <img src={editIcon} alt="edit" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="data-field">
                    <div className="field-content">
                        <label>Email</label>
                        {isEditingEmail ? (
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="edit-input"
                                autoFocus
                            />
                        ) : (
                            <p>{email}</p>
                        )}
                    </div>
                    <div className="button-group">
                        {isEditingEmail ? (
                            <>
                                <button className="cancel-edit-button" onClick={handleCancelEmail}>
                                    Cancel
                                </button>
                                <button className="save-button" onClick={() => setIsEditingEmail(false)}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <button className="edit-button" onClick={handleEditEmail}>
                                <img src={editIcon} alt="edit" />
                            </button>
                        )}
                    </div>
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