import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {signUpPassenger} from '../api/signUpPassengerApi.ts';
import '../styles/signUp.css';

function SignUpPassenger() {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, success} = useSelector((state: RootState) => state.passengerSignUp);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const passengerData = {
            ...formData,
            rating: 0,
        };

        dispatch(signUpPassenger(passengerData));
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
                <h1 className="signup-title">Passenger Sign Up</h1>

                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">Registration successful!</div>}

                <form onSubmit={handleSubmit} className="signup-form">

                    <h2>Personal Information</h2>

                    <div className="inputs-container">
                        <div className="input">
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

                        <div className="input">
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input">
                            <input
                                required
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input">
                            <input
                                required
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
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

export default SignUpPassenger;