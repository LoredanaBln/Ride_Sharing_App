import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';
import backIcon from '../images/back.png';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-container">
            <div className="about-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <img src={backIcon} alt="Back" />
                </button>
                <h1>About Us</h1>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        To revolutionize urban transportation by providing safe, reliable, 
                        and affordable rides while creating opportunities for drivers and 
                        making cities more accessible for everyone. We strive to build 
                        a community based on trust, convenience, and mutual respect.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        Founded in 2024, our platform emerged from a simple idea:
                        to make transportation more accessible and efficient. What started 
                        as a local initiative has grown into a comprehensive mobility 
                        solution, connecting thousands of passengers with reliable drivers.
                    </p>
                </section>

                <section className="about-section">
                    <h2>How It Works</h2>
                    <div className="feature">
                        <h3>For Passengers</h3>
                        <ul>
                            <li>Request rides anytime, anywhere in our service area</li>
                            <li>Track your driver's location in real-time</li>
                            <li>Choose from multiple payment options (cash or card)</li>
                            <li>Rate your experience and provide feedback</li>
                            <li>Access your ride history and favorite routes</li>
                            <li>Receive accurate fare estimates before booking</li>
                        </ul>
                    </div>
                    <div className="feature">
                        <h3>For Drivers</h3>
                        <ul>
                            <li>Flexible working hours - be your own boss</li>
                            <li>Secure and timely payments</li>
                            <li>Built-in navigation system</li>
                            <li>24/7 support and assistance</li>
                            <li>Access to a large passenger network</li>
                            <li>Performance tracking and analytics</li>
                        </ul>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Safety First</h2>
                    <p>
                        Your safety is our highest priority. We implement comprehensive 
                        security measures including:
                    </p>
                    <ul className="safety-list">
                        <li>Thorough background checks for all drivers</li>
                        <li>Real-time ride tracking and sharing</li>
                        <li>24/7 emergency response team</li>
                        <li>Two-way rating system</li>
                        <li>Secure payment processing</li>
                        <li>Insurance coverage during rides</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Our Technology</h2>
                    <p>
                        We leverage cutting-edge technology to provide the best possible 
                        experience. Our platform features advanced route optimization, 
                        real-time tracking, smart matching algorithms, and secure payment 
                        processing to ensure smooth and efficient rides every time.
                    </p>
                </section>

                <div className="version-info">
                    <p>Version 1.0.0</p>
                    <p>© 2023 Ride Sharing. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default About; 