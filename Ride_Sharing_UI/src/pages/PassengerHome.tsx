import {useEffect, useState} from "react";
import "../styles/passengerHome.css";
import "../styles/drawer_menu.css";
import arrowIcon from "../images/arrow.png";
import menu from "../images/menu.png";
import search from "../images/search.png";
import my_location from "../images/my_location.png";
import pay from "../images/pay.png";
import back from "../images/back.png";
import support from "../images/support.png";
import about from "../images/about.png";
import logout from "../images/logout.png";
import homeIcon from "../images/home.png";
import accountIcon from "../images/account.png";
import historyIcon from "../images/history.png";

import {useNavigate} from "react-router-dom";
import {RootState} from "../store/store.ts";
import {useSelector} from "react-redux";
import {fetchPassengerByEmail} from "../api/passengerRetrievalByEmail.ts";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {GeoLocation} from "../types/location.ts";

function PassengerHome() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const navigate = useNavigate();

    const userEmail = useSelector((state: RootState) => state.auth.userEmail)!;
    const [passenger, setPassenger] = useState<any>(null);
    const [, setError] = useState<string | null>(null);
    const [defaultPosition] = useState<[number, number]>([46.7712, 23.6236,]); // Cluj-Napoca
    const [searchValue, setSearchValue] = useState("");
    const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(
        null
    );
    const [map, setMap] = useState<L.Map | null>(null);

    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const data = await fetchPassengerByEmail(userEmail);
                setPassenger(data);
                console.log("Fetched passenger data:", data);
                setError(null);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(
                        err.message || "An error occurred while fetching passenger data"
                    );
                }
            }
        };
        fetchPassenger();
    }, [userEmail]);

    useEffect(() => {
        handleMyLocationClick();
    }, []);

    const handleMenuToggle = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleMyLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    map?.flyTo([newLocation.latitude, newLocation.longitude], 15);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
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
                    <img src={search} alt="search" className="search-icon"/>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Where to?"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="map-container">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    zoomControl={false}
                    style={{height: "100%", width: "100%"}}
                    ref={setMap}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                    />
                    {currentLocation && (
                        <Marker
                            position={[currentLocation.latitude, currentLocation.longitude]}
                        />
                    )}
                </MapContainer>
            </div>

            <div className="button-bar">
                <div className="menu-wrapper">
                    <button
                        className="location-button-pass"
                        onClick={handleMyLocationClick}
                    >
                        <img src={my_location} alt="expand" className="location-icon"/>
                    </button>
                    <div className={`expanded-menu ${isMenuVisible ? "visible" : ""}`}>
                        <button
                            className="menu-item"
                            onClick={() => navigate("/passenger-home")}
                        >
                            <img src={homeIcon} alt="home" className="location-icon"/>
                        </button>
                        <button
                            onClick={() =>
                                navigate("/my-account-passenger", {state: {passenger}})
                            }
                            className="menu-item"
                        >
                            <img src={accountIcon} alt="account" className="location-icon"/>
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => navigate("/passenger-rides-history")}
                        >
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
