import { useNavigate } from 'react-router-dom';
import '../styles/support.css';
import backIcon from '../images/back.png';

const Support = () => {
    const navigate = useNavigate();

    return (
        <div className="support-container">
            <div className="support-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <img src={backIcon} alt="Back" />
                </button>
                <h1>Support Center</h1>
            </div>

            <div className="support-content">
                <section className="support-section">
                    <h2>24/7 Customer Support</h2>
                    <p>
                        Our dedicated support team is available around the clock to assist 
                        you with any questions or concerns you may have.
                    </p>
                </section>

                <section className="support-section">
                    <h2>Contact Information</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <h3>Emergency Support</h3>
                            <p>Phone: 1-800-RIDE-911</p>
                            <p>Available 24/7 for urgent situations</p>
                        </div>
                        <div className="contact-item">
                            <h3>General Inquiries</h3>
                            <p>Email: support@ridesharing.com</p>
                            <p>Response time: Within 24 hours</p>
                        </div>
                        <div className="contact-item">
                            <h3>Business Hours</h3>
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Weekend: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                </section>

                <section className="support-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <div className="faq-item">
                            <h3>How do I request a ride?</h3>
                            <p>
                                Simply open the app, enter your destination, and tap 
                                "Request Ride". You'll be matched with a nearby driver.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3>Payment Issues</h3>
                            <p>
                                If you're experiencing payment problems, ensure your payment 
                                method is up to date. For further assistance, contact our 
                                support team.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3>Lost Items</h3>
                            <p>
                                Contact our support team immediately if you've left something 
                                in a vehicle. We'll help coordinate with your driver.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="support-section">
                    <h2>Submit a Request</h2>
                    <p>
                        For non-urgent issues, please submit a support ticket through our 
                        email system. Include your ride details and any relevant information 
                        to help us assist you better.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Support; 