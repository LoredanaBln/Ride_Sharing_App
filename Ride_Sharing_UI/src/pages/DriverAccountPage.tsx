import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/passengerAccount.css';
import avatarIcon from '../images/avatar.png';
import backIcon from '../images/backGreen.png';
import { updateDriver } from "../api/driverUpdate.ts";

function DriverAccountPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const driver = location.state?.driver || null;

    const [isEditing, setIsEditing] = useState(false);

    const [originalDriverData, setOriginalDriverData] = useState(driver);


    const [name, setName] = useState(driver?.name || '');
    const [phone, setPhone] = useState(driver?.phoneNumber || '');
    const [email, setEmail] = useState(driver?.email || '');
    const [carType, setCarType] = useState(driver?.carType || '');
    const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber || '');
    const [carColor, setCarColor] = useState(driver?.carColor || '');
    const rating = useState(driver?.rating || '');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleCarTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => setCarType(e.target.value);
    const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => setLicenseNumber(e.target.value);
    const handleCarColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setCarColor(e.target.value);

    const handleSaveClick = async () => {
        if (!driver) {
            console.error("Driver data not found");
            return;
        }

        const updatedDriverData = {
            ...driver,
            name: name !== driver.name ? name : driver.name,
            phoneNumber: phone !== driver.phoneNumber ? phone : driver.phoneNumber,
            email: email !== driver.email ? email : driver.email,
            carType: carType !== driver.carType ? carType : driver.carType,
            licenseNumber: licenseNumber !== driver.licenseNumber ? licenseNumber : driver.licenseNumber,
            carColor: carColor !== driver.carColor ? carColor : driver.carColor,
        };

        try {
            await updateDriver(updatedDriverData);
            setIsEditing(false);
            alert("Driver information updated successfully!");
        } catch (error) {
            console.error("Failed to update driver:", error);
            alert("Failed to update driver information.");
        }
    };

    const handleCancelClick = () => {
        if (originalDriverData) {
            setName(originalDriverData.name);
            setPhone(originalDriverData.phoneNumber);
            setEmail(originalDriverData.email);
            setCarType(originalDriverData.carType);
            setLicenseNumber(originalDriverData.licenseNumber);
            setCarColor(originalDriverData.carColor);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (driver) {
            setOriginalDriverData(driver);
        }
    }, [driver]);

    return (
        <div className="account-container">
            <button className="back-button" onClick={() => navigate('/driver-home')}>
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
                        <span className="rating-value">{rating}</span>
                    </div>
                </div>
            </div>

            <div className="personal-data-section">
                <h3>Personal Information</h3>

                {[
                    { label: 'Name', value: name, onChange: handleNameChange },
                    { label: 'Phone', value: phone, onChange: handlePhoneChange },
                    { label: 'Email', value: email, onChange: handleEmailChange },
                    { label: 'Car type', value: carType, onChange: handleCarTypeChange },
                    { label: 'License number', value: licenseNumber, onChange: handleLicenseNumberChange },
                    { label: 'Car color', value: carColor, onChange: handleCarColorChange },
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

export default DriverAccountPage;
