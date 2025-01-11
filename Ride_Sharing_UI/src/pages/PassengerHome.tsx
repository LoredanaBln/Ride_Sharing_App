import {useEffect, useState} from "react";
import "../styles/passengerHome.css";
import "../styles/drawer_menu.css";
import mapImage from "../images/map.jpg";
import arrowIcon from "../images/arrow.png";
import menu from "../images/menu.png";
import search from "../images/search.png";
import my_location from "../images/my_location.png";
import pay from "../images/pay.png";
import back from "../images/back.png";
import support from "../images/support.png"
import about from "../images/about.png"
import logout from "../images/logout.png"
import homeIcon from "../images/home.png";
import accountIcon from "../images/account.png";
import historyIcon from "../images/history.png";

import {useNavigate} from "react-router-dom";
import {RootState} from "../store/store.ts";
import {useSelector} from "react-redux";
import {fetchPassengerByEmail} from "../api/passengerRetrievalByEmail.ts";

function PassengerHome() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const navigate = useNavigate();

    const userEmail = useSelector((state: RootState) => state.auth.userEmail)!;
    const [passenger, setPassenger] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const data = await fetchPassengerByEmail(userEmail);
                setPassenger(data);
                console.log("Fetched passenger data:", data);
                setError(null); // Clear any previous errors
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "An error occurred while fetching passenger data");
                }
            }
        };

        fetchPassenger();
    }, [userEmail]);

    const handleMenuToggle = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <div className="passenger-container">
            <div id="drawer" className={`drawer ${isDrawerVisible ? "visible" : ""}`}>
                <div className="drawer-content">
                    <button onClick={() => setIsDrawerVisible(false)}>
                        <img src={back} alt="back" className="back-icon"/>
                    </button>
                    <ul>
                        <li onClick={() => navigate("/payment")}>
                            <img src={pay} alt="pay" className="pay-icon"/>
                            Payment
                        </li>
                        <li onClick={() => navigate("/support")}>
                            <img src={support} alt="pay" className="pay-icon"/>
                            Support
                        </li>
                        <li onClick={() => navigate("/about")}>
                            <img src={about} alt="pay" className="pay-icon"/>
                            About
                        </li>
                        <li>
                            <img src={logout} alt="logout" className="pay-icon"/>
                            Logout
                        </li>
                    </ul>
                </div>
            </div>

            <div className="search-bar-container">
                <button
                    onClick={() => setIsDrawerVisible(true)}
                    className="drawer-menu-button"
                >
                    <img src={menu} alt="menu" className="menu-icon"/>

                </button>
                <div className="search-input-wrapper">
                    <img
                        src={search} alt="search"
                        className="search-icon"
                    />
                    <input type="text" className="search-input" placeholder="Where to?"/>
                </div>
            </div>

            <div className="map-container">
                <img src={mapImage} alt="map" className="map-image"/>
            </div>

            <div className="button-bar">
                <div className="menu-wrapper">
                    <button className="location-button-pass">
                        <img src={my_location} alt="expand" className="location-icon"/>
                    </button>
                    <div className={`expanded-menu ${isMenuVisible ? "visible" : ""}`}>
                        <button className="menu-item" onClick={() => navigate("/passenger-home")}>
                            <img src={homeIcon} alt="home" className="location-icon"/>
                        </button>
                        <button onClick={() => navigate("/my-account-passenger", {state: {passenger}})}
                                className="menu-item">
                            <img src={accountIcon} alt="account" className="location-icon"/>
                        </button>

                        <button className="menu-item" onClick={() => navigate("/passenger-rides-history")}>
                            <img src={historyIcon} alt="history" className="location-icon"/>
                        </button>

                    </div>
                    <button
                        className={`expand-button ${isMenuVisible ? "expanded" : ""}`}
                        onClick={handleMenuToggle}
                    >
                        <img src={arrowIcon} alt="expand"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PassengerHome;
