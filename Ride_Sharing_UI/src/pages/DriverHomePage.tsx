import { useState } from 'react';
import '../styles/driverHome.css';
import mapImage from '../images/map.jpg';
import arrowIcon from '../images/arrow.png';
import homeIcon from '../images/home.png';
import accountIcon from '../images/account.png';
import historyIcon from '../images/history.png';
import menuIcon from '../images/menu.png';
import locationIcon from '../images/location.png';

function DriverHomePage() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <div className="container">
            <button className="menu-button">
                <img src={menuIcon} alt="menu" />
            </button>
            <div className="map-container">
                <img src={mapImage} alt="map" className="map-image"/>
            </div>
            <div className="button-bar">
                <button className="location-button">
                    <img src={locationIcon} alt="location" />
                </button>
                <button className="online-toggle">
                    Go Online
                </button>
                <div className="menu-wrapper">
                    <div className={`expanded-menu ${isMenuVisible ? 'visible' : ''}`}>
                        <button className="menu-item">
                            <img src={homeIcon} alt="home" className="home-icon"/>
                        </button>
                        <button className="menu-item">
                            <img src={accountIcon} alt="home" className="account-icon"/>
                        </button>
                        <button className="menu-item">
                            <img src={historyIcon} alt="history" className="history-icon"/>
                        </button>
                    </div>
                    <button
                        className={`expand-button ${isMenuVisible ? 'expanded' : ''}`}
                        onClick={handleMenuToggle}
                    >
                        <img src={arrowIcon} alt="expand" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DriverHomePage;