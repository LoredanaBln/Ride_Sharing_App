import { useState } from "react";
import "../styles/driverHome.css";
import "../styles/drawer_menu.css";
import mapImage from "../images/map.jpg";
import arrowIcon from "../images/arrow.png";
import homeIcon from "../images/home.png";
import accountIcon from "../images/account.png";
import historyIcon from "../images/history.png";
import menu from "../images/menu_icon.png";
import locationIcon from "../images/location.png";
import back from "../images/back.png";
import pay from "../images/pay.png";
import support from "../images/support.png";
import about from "../images/about.png";
import logoutIcon from "../images/logout.png";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/loginSlice.ts";
import { fetchDriverByEmail } from "../api/driverRetrievalByEmail.ts";
import { updateDriver } from "../api/driverUpdate.ts";


function DriverHomePage() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userEmail = useSelector((state: any)=> state.auth.userEmail)!;

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    if (!userEmail) {
      console.error("User email not found in state");
      return;
    }

    try {
      const driver = await fetchDriverByEmail(userEmail);

      if (!driver || typeof driver !== "object" || !("id" in driver)) {
        console.error("Driver not found or invalid response");
        return;
      }

      const updatedDriver = {
        ...driver,
        status: "OFFLINE",
      };

      await updateDriver(updatedDriver);

      dispatch(logout());

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
      <div className="drivercontainer">
        <div id="drawer" className={`drawer ${isDrawerVisible ? "visible" : ""}`}>
          <div className="drawer-content">
            <button onClick={() => setIsDrawerVisible(false)}>
              <img src={back} alt="back" className="back-icon" />
            </button>
            <ul>
              <li onClick={() => navigate("/payment")}>
                <img src={pay} alt="pay" className="pay-icon" />
                Payment
              </li>
              <li onClick={() => navigate("/support")}>
                <img src={support} alt="pay" className="pay-icon" />
                Support
              </li>
              <li onClick={() => navigate("/about")}>
                <img src={about} alt="pay" className="pay-icon" />
                About
              </li>
              <li onClick={handleLogout}>
                <img src={logoutIcon} alt="pay" className="pay-icon" />
                Logout
              </li>
            </ul>
          </div>
        </div>
        <div className="map-container">
          <img src={mapImage} alt="map" className="map-image" />
          <button
              onClick={() => setIsDrawerVisible(true)}
              className="drawer-menu-button"
          >
            <img src={menu} alt="menu" className="menu-icon" />
          </button>
        </div>
        <div className="button-bar">
          <button className="location-button">
            <img src={locationIcon} alt="location" />
          </button>
          <button className="online-toggle">Go Online</button>
          <div className="menu-wrapper">
            <div className={`expanded-menu ${isMenuVisible ? "visible" : ""}`}>
              <button className="menu-item">
                <img src={homeIcon} alt="home" className="home-icon" />
              </button>
              <button
                  onClick={() => navigate("/my-account-driver")}
                  className="menu-item"
              >
                <img src={accountIcon} alt="home" className="account-icon" />
              </button>
              <button className="menu-item">
                <img src={historyIcon} alt="history" className="history-icon" />
              </button>
            </div>
            <button
                className={`expand-button ${isMenuVisible ? "expanded" : ""}`}
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