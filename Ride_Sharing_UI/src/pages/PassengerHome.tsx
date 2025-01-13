import { useEffect, useState } from "react";
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

import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassengerByEmail } from "../api/passengerRetrievalByEmail.ts";
import { logout } from "../slices/loginSlice.ts";
import { setOrderNotification } from "../slices/orderNotificationSlice";
import Map from "../components/Map";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Passenger } from "../types/passenger.ts";
import { createOrderApi } from "../api/createOrderApi.ts";
import { Order } from "../types/order.ts";
import { getLocationName } from "../api/getLocationName.ts";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useSearch } from "../hooks/useSearch.ts";
import { getDefaultPaymentMethod } from "../api/payment/passenger/getDefaultPaymentMethod.ts";
import { Client } from '@stomp/stompjs';
import OrderStatusCard from '../components/OrderStatusCard';
import { OrderNotification } from '../types/OrderNotification';
import SockJS from 'sockjs-client';

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

  const [map, setMap] = useState<L.Map | null>(null);
  const { currentLocation, handleMyLocationClick } = useCurrentLocation(map);

  const { destination, routeCoordinates, routeInfo, handleSearch } = useSearch({
    currentLocation,
    map,
  });

  const orderNotification = useSelector((state: RootState) => state.orderNotification.notification);

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

  const handleSearchInput = async () => {
    const success = await handleSearch(searchValue);
    if (success) {
      setIsRouteInfoVisible(true);
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

    try {
      const defaultPaymentMethod = await getDefaultPaymentMethod(Number(passenger.id));

      const startLocationName = await getLocationName(
        currentLocation.latitude,
        currentLocation.longitude
      );

      const newOrder: Order = {
        passengerId: Number(passenger.id),
        startLocation: startLocationName,
        endLocation: searchValue,
        startLatitude: currentLocation.latitude,
        startLongitude: currentLocation.longitude,
        endLatitude: destination.latitude,
        endLongitude: destination.longitude,
        paymentType: defaultPaymentMethod ? "CREDIT_CARD" : "CASH",
        estimatedPrice: Number(routeInfo.distanceInKm.toFixed(2)),
      };

      await dispatch(createOrderApi(newOrder));
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  useEffect(() => {
    if (!passenger) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        const destination = `/topic/passengers/${passenger.id}/orders`;
        console.log('Subscribing to:', destination);
        
        try {
          client.subscribe(destination, (message) => {
            console.log('Received message:', message);
            const notification = JSON.parse(message.body);
            dispatch(setOrderNotification(notification));
          });
        } catch (error) {
          console.error('Error subscribing to destination:', error);
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    try {
      console.log('Activating STOMP client...');
      client.activate();
    } catch (error) {
      console.error('Error activating STOMP client:', error);
    }

    return () => {
      if (client.active) {
        console.log('Deactivating STOMP client');
        client.deactivate();
      }
    };
  }, [passenger, dispatch]);

  return (
    <div className="passenger-container">
      <div id="drawer" className={`drawer ${isDrawerVisible ? "visible" : ""}`}>
        <div className="drawer-content">
          <button onClick={() => setIsDrawerVisible(false)}>
            <img src={back} alt="back" className="back-icon" />
          </button>
          <ul>
            <li onClick={() => navigate("/passenger-payment")}>
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
              <img src={logoutIcon} alt="logout" className="pay-icon" />
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
          <img src={menu} alt="menu" className="menu-icon" />
        </button>
        <div className="search-input-wrapper">
          <img src={search} alt="search" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Where to?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchInput();
              }
            }}
          />
        </div>
      </div>

      <div className="map-container">
        <Map
          currentLocation={currentLocation}
          destination={destination}
          routeCoordinates={routeCoordinates}
          onMapReady={setMap}
          defaultPosition={defaultPosition}
        />
      </div>

      <div className="button-bar">
        <div className="menu-wrapper">
          <button
            className="location-button-pass"
            onClick={handleMyLocationClick}
          >
            <img src={my_location} alt="expand" className="location-icon" />
          </button>
          <div className={`expanded-menu ${isMenuVisible ? "visible" : ""}`}>
            <button
              className="menu-item"
              onClick={() => navigate("/passenger-home")}
            >
              <img src={homeIcon} alt="home" className="location-icon" />
            </button>
            <button
              onClick={() =>
                navigate("/my-account-passenger", { state: { passenger } })
              }
              className="menu-item"
            >
              <img src={accountIcon} alt="account" className="location-icon" />
            </button>

            <button
              className="menu-item"
              onClick={() => navigate("/passenger-rides-history")}
            >
              <img src={historyIcon} alt="history" className="location-icon" />
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

      {isRouteInfoVisible && routeInfo && (
        <div className="route-info-popup">
          <div className="route-info-card">
            <button
              className="close-button"
              onClick={() => setIsRouteInfoVisible(false)}
            >
              ×
            </button>
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

      {orderNotification && (
        <OrderStatusCard 
          notification={orderNotification}
          onClose={() => {
            const isRideActive = orderNotification.status === 'ACCEPTED' || 
                                orderNotification.status === 'IN_PROGRESS';
            if (!isRideActive) {
              dispatch(setOrderNotification(null));
            }
          }}
        />
      )}
    </div>
  );
}

export default PassengerHome;
