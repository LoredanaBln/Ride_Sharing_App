import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/passengerHome.css";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {fetchPassengerByEmail} from "../api/passengerRetrievalByEmail.ts";

const PassengerHome: React.FC = () => {
    const navigate = useNavigate();
    const userEmail: string = useSelector((state: RootState): string => state.auth.userEmail!);
    const [passenger, setPassenger] = useState<any>(null);
        const [ , setError] = useState<string | null>(null);

    const openDrawer = () => {
        const drawer = document.getElementById("drawer");
        drawer?.classList.add("open");
    };

    const closeDrawer = () => {
        const drawer = document.getElementById("drawer");
        drawer?.classList.remove("open");
    };


    useEffect(() => {
        const fetchPassenger = async () => {
            try {
                const data = await fetchPassengerByEmail(userEmail);
                setPassenger(data);
                setError(null);
            } catch (err: unknown) {
                if (err instanceof Error)
                    setError(err.message || "An error occurred while fetching passenger data");
            }
        };

        fetchPassenger();
    }, [userEmail]);

    return (
        <div className="container">
            <div className="home-page">
                <div id="drawer" className="drawer">
                    <div className="drawer-content">
                        <div className="drawer-header">
                            <h2>Menu</h2>
                            <button className="close-button" onClick={closeDrawer}>
                                ×
                            </button>
                        </div>
                        <nav className="drawer-nav">
                            <ul>
                                <li>
                                    <button
                                        onClick={() => {
                                            closeDrawer();
                                            navigate("/payment");
                                        }}
                                    >
                                        Payment
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            closeDrawer();
                                            navigate("/support");
                                        }}
                                    >
                                        Support
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            closeDrawer();
                                            navigate("/about");
                                        }}
                                    >
                                        About
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <header className="top-bar">
                    <button className="menu-button" onClick={openDrawer}>
                        <span className="menu-icon">☰</span>
                    </button>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Where would you like to go?"
                            aria-label="Search destination"
                        />
                        <button className="search-button">Search</button>
                    </div>
                </header>

                <main className="map-container">
                    <h1>HERE MAY LAY THE MAP</h1>
                    <div className="passenger-details">
                        <p><strong>Email:</strong> {userEmail}</p>
                    </div>
                </main>

                <nav className="bottom-nav">
                    <button className="nav-button" onClick={() => navigate("/")}>
                        <span className="icon">🏠</span>
                        <span>Home</span>
                    </button>
                    <button className="nav-button"
                            onClick={() => navigate("/my-account-passenger", {state: {passenger}})}>
                        <span className="icon">👤</span>
                        <span>Account</span>
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate("/rides-history")}
                    >
                        <span className="icon">🕒</span>
                        <span>History</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default PassengerHome;
