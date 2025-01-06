import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const PassengerHome: React.FC = () => {
    const navigate = useNavigate();

    const openDrawer = () => {
        const drawer = document.getElementById("drawer");
        drawer?.classList.add("open");
    };

    const closeDrawer = () => {
        const drawer = document.getElementById("drawer");
        drawer?.classList.remove("open");
    };

    return (
        <div className="home-page">
            {/* Drawer Menu */}
            <div id="drawer" className="drawer">
                <div className="drawer-content">
                    <button onClick={closeDrawer}>Close</button>
                    <ul>
                        <li onClick={() => navigate("/payment")}>Payment Page</li>
                        <li onClick={() => navigate("/support")}>Support Page</li>
                        <li onClick={() => navigate("/about")}>About Page</li>
                    </ul>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input type="text" placeholder="Search for a ride..." />
                <button>Search</button>
            </div>

            {/* Map */}
            <div className="map-container">
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "300px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>

            {/* Bottom Menu */}
            <div className="bottom-menu">
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/account")}>My Account</button>
                <button onClick={() => navigate("/rides-history")}>Rides History</button>
            </div>

            {/* Open Drawer Button */}
            <button className="drawer-button" onClick={openDrawer}>
                Menu
            </button>
        </div>
    );
};

export default PassengerHome;
