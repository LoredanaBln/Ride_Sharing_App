import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {signUpDriver} from '../api/signUpDriverApi.ts';
import '../styles/signUp.css';

function SignUpDriver() {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, success} = useSelector((state: RootState) => state.driverSignUp);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        passwordHash: '',
        phoneNumber: '',
        carType: '',
        licenseNumber: '',
        carColor: '',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const driverData = {
            ...formData,
            status: 'OFFLINE',
            rating: 0,
        };

        dispatch(signUpDriver(driverData));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div className="container">
            <div className="signup-container">
                <h1 className="signup-title">Driver Sign Up</h1>

                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">Registration successful!</div>}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="inputs-container">
                        <h2>Personal Information</h2>
                        <div className="input-group">
                            <input
                                required
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                type="password"
                                name="passwordHash"
                                placeholder="Password"
                                value={formData.passwordHash}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <h2>Vehicle Information</h2>
                        <div className="input-group">
                            <input
                                required
                                type="text"
                                name="carType"
                                placeholder="Car Type/Model"
                                value={formData.carType}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                type="text"
                                name="licenseNumber"
                                placeholder="License Number"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                type="text"
                                name="carColor"
                                placeholder="Car Color"
                                value={formData.carColor}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpDriver;