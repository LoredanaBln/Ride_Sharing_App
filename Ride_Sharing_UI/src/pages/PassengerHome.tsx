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
import logoutIcon from "../images/logout.png";
import homeIcon from "../images/home.png";
import accountIcon from "../images/account.png";
import historyIcon from "../images/history.png";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

import {useNavigate} from "react-router-dom";
import {RootState, AppDispatch} from "../store/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {fetchPassengerByEmail} from "../api/passengerRetrievalByEmail.ts";
import {logout} from "../slices/loginSlice.ts";
import {MapContainer, TileLayer, Marker, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {GeoLocation} from "../types/location.ts";
import {getLocationCoordinatesApi} from "../api/getLocationCoordinatesApi.ts";
import polyline from "@mapbox/polyline";
import {getRouteApi} from "../api/getRouteApi.ts";
import L from "leaflet";
import {RouteInfo} from "../types/locationInfo.ts";
import {Passenger} from "../types/passenger.ts";
import {createOrderApi} from "../api/createOrderApi.ts";
import {Order} from "../types/order.ts";
import {getLocationName} from "../api/getLocationName.ts";

const currentLocationIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: "current-location-marker",
});

const destinationIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: "destination-marker",
});

function PassengerHome() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isRouteInfoVisible, setIsRouteInfoVisible] = useState(false);

    const userEmail = useSelector((state: RootState) => state.auth.userEmail)!;
    const [passenger, setPassenger] = useState<Passenger | null>(null);
    const [, setError] = useState<string | null>(null);
    const [defaultPosition] = useState<[number, number]>([46.7712, 23.6236]); // Cluj-Napoca
    const [searchValue, setSearchValue] = useState("");
    const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(
        null
    );
    const [map, setMap] = useState<L.Map | null>(null);
    const [destination, setDestination] = useState<GeoLocation | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
        []
    );
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const data: Passenger | null = await fetchPassengerByEmail(userEmail);
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

    const handleSearch = async () => {
        try {
            if (searchValue.trim() && currentLocation) {
                const coordinates = await getLocationCoordinatesApi.getCoordinates(
                    searchValue
                );
                setDestination(coordinates);

                const route = await getRouteApi.getRoute(currentLocation, coordinates);

                const decodedCoordinates = polyline.decode(route.geometry);
                const formattedCoordinates = decodedCoordinates.map(
                    ([lat, lng]: [number, number]) => [lat, lng] as [number, number]
                );
                setRouteCoordinates(formattedCoordinates);

                if (map) {
                    const bounds = formattedCoordinates.reduce(
                        (bounds, coord) => bounds.extend(coord),
                        L.latLngBounds(formattedCoordinates[0], formattedCoordinates[0])
                    );
                    map.fitBounds(bounds);
                }

                setRouteInfo(route);
                console.log(route);
                setIsRouteInfoVisible(true);
            }
        } catch (error) {
            console.error("Error searching location or getting route:", error);
        }
    };

    useEffect(() => {
        handleMyLocationClick();
    }, []);

    const handleMenuToggle = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleLogout = () => {
        setPassenger(null);
        setError(null);

        dispatch(logout());

        navigate("/");
    };

    const handleCreateOrder = async () => {
        if (!passenger || !currentLocation || !destination || !routeInfo) {
            console.error("Missing required data for order creation");
            return;
        }

        const startLocationName = await getLocationName(currentLocation.latitude, currentLocation.longitude);
        const newOrder: Order = {
            passengerId: Number(passenger.id),
            startLocation: startLocationName,
            endLocation: searchValue,
            startLatitude: currentLocation.latitude,
            startLongitude: currentLocation.longitude,
            endLatitude: destination.latitude,
            endLongitude: destination.longitude,
            paymentType: "CASH",
            estimatedPrice: Number(routeInfo.distanceInKm.toFixed(2)),
        };

        await dispatch(createOrderApi(newOrder));
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
                        <li onClick={handleLogout}>
                            <img src={logoutIcon} alt="logout" className="pay-icon"/>
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
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>
            </div>

            <div className="map-container">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
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
                            icon={currentLocationIcon}
                        />
                    )}
                    {destination && (
                        <Marker
                            position={[destination.latitude, destination.longitude]}
                            icon={destinationIcon}
                        />
                    )}
                    {routeCoordinates.length > 0 && (
                        <Polyline
                            positions={routeCoordinates}
                            color="blue"
                            weight={4}
                            opacity={0.7}
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

            {isRouteInfoVisible && routeInfo && (
                <div className="route-info-popup">
                    <div className="route-info-card">
                        <div className="route-details">
                            <h3>Ride Details</h3>
                            <p>Distance: {routeInfo.distanceInKm.toFixed(2)} km</p>
                            <p>Duration: {Math.round(routeInfo.durationInMinutes)} minutes</p>
                            <p>Estimated Price: ${routeInfo.distanceInKm.toFixed(2)}</p>
                        </div>
                        <button className="create-order-button" onClick={handleCreateOrder}>
                            Create Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PassengerHome;
