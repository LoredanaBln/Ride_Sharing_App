import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import '../styles/login.css';
import {useNavigate} from "react-router-dom";
import {logout} from "../slices/loginSlice.ts";
import {login} from "../api/loginApi.ts";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        console.log(result);

        if (login.fulfilled.match(result)) {

            if (result.payload.role === 'ROLE_PASSENGER') {
                navigate('/passenger-home');
            } else if (result.payload.role === 'ROLE_DRIVER') {
                navigate('/driver-home');
            } else {
                dispatch(logout());
            }
        }
    };

    const handleSignUpPassenger = () => {
        navigate('/signup-passenger');
    };

    const handleSignUpDriver = () => {
        navigate('/signup-driver');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Welcome</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="email-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? "login-error" : undefined}
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={"current-password"}
                            required
                            className="password-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? "login-error" : undefined}
                        />
                    </div>

                    <button
                        type="button"
                        className="forgot-password-button"
                        onClick={() => navigate('/reset-password')}
                    >
                        Forgot Password?
                    </button>

                    {error && (
                        <div id="login-error" className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="submit-button"
                        aria-busy={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="signup-buttons">
                        <button
                            type="button"
                            className="signup-button driver"
                            onClick={handleSignUpDriver}
                        >
                            Sign up as Driver
                        </button>
                        <button
                            type="button"
                            className="signup-button passenger"
                            onClick={handleSignUpPassenger}
                        >
                            Sign up as Passenger
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;