import { useState, useEffect } from "react";
import "../styles/driverHome.css";
import "../styles/drawer_menu.css";
import arrowIcon from "../images/arrow.png";
import homeIcon from "../images/home.png";
import accountIcon from "../images/account.png";
import historyIcon from "../images/history.png";
import menu from "../images/menu_icon.png";
import back from "../images/back.png";
import pay from "../images/pay.png";
import support from "../images/support.png";
import about from "../images/about.png";
import logoutIcon from "../images/logout.png";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/loginSlice.ts";
import { updateDriver } from "../api/driverUpdate.ts";
import { toggleDriverStatus } from "../api/toggleDriverStatus.ts";
import { Driver } from "../types/driver.ts";
import { AppDispatch } from "../store/store.ts";
import { fetchDriverByEmail } from "../api/driverRetrievalByEmail.ts";
import { useCurrentLocation } from "../hooks/useCurrentLocation.ts";
import L from "leaflet";
import Map from "../components/Map.tsx";
import my_location from "../images/my_location.png";
import { Client } from "@stomp/stompjs";
import { OrderNotification } from "../types/OrderNotification";
import SockJS from "sockjs-client";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import { toast } from "react-hot-toast";
import { cancelOrder } from "../api/cancelOrder.ts";
import { completeOrder } from "../api/completeOrder.ts";
import { CancelOrderPrompt } from "../components/CancelReasonToast.tsx";

function DriverHomePage() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [driverStatus, setDriverStatus] = useState<
    "OFFLINE" | "AVAILABLE" | "BUSY"
  >("OFFLINE");
  const [orderAction, setIsOrderAction] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userEmail = useSelector((state: any) => state.auth.userEmail)!;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [, setError] = useState<string | null>(null);
  const [orderRequest, setOrderRequest] = useState<OrderNotification | null>(
    null
  );

  const [order, setOrder] = useState<any>();
  const [, setStompClient] = useState<Client | null>(null);

  const [map, setMap] = useState<L.Map | null>(null);
  const { currentLocation, handleMyLocationClick } = useCurrentLocation(map);
  const [defaultPosition] = useState<[number, number]>([46.7712, 23.6236]); // Cluj-Napoca

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const data: Driver | null = await fetchDriverByEmail(userEmail);
        setDriver(data);
        console.log("Fetched driver data:", data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(
            err.message || "An error occurred while fetching passenger data"
          );
        }
      }
    };
    fetchDriver();
  }, [userEmail]);

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

      setDriver(null);
      setError(null);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const resultAction = await dispatch(toggleDriverStatus());
      if (toggleDriverStatus.fulfilled.match(resultAction)) {
        setDriverStatus(resultAction.payload.status);
      }
    } catch (error) {
      console.error("Error toggling driver status:", error);
    }
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const driver: Driver = await fetchDriverByEmail(userEmail);
        if (driver && driver.status) {
          setDriverStatus(driver.status);
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchDriver();
  }, [userEmail]);

  useEffect(() => {
    handleMyLocationClick();
  }, []);

  // Add WebSocket connection
  useEffect(() => {
    if (!userEmail) {
      console.log("No user email found, skipping WebSocket connection");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    console.log("Initializing WebSocket connection for user:", userEmail);

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      const destination = `/topic/drivers/${userEmail}/orders`;
      console.log("Subscribing to:", destination);

      try {
        const subscription = client.subscribe(destination, (message) => {
          console.log("Received message:", message);
          const notification = JSON.parse(message.body);
          console.log(notification);
          setOrderRequest(notification);
        });
        console.log("Subscription successful:", subscription);
      } catch (error) {
        console.error("Error subscribing to destination:", error);
      }
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        console.log("Deactivating STOMP client");
        client.deactivate();
      }
    };
  }, [userEmail]);

  const handleAcceptOrder = async () => {
    setIsOrderAction(true);
    if (!orderRequest) return;

    try {
      const response = await fetch(
        `${API_ENDPOINTS.ACCEPT_ORDER}/${orderRequest.orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to accept order:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to accept order: ${errorText}`);
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      console.log("Order accepted successfully:", updatedOrder);

      setOrderRequest(null);
      setDriverStatus("BUSY");

      toast.success("Order accepted successfully!");
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept order"
      );
    }
  };

  const handleRejectOrder = async () => {
    if (!orderRequest) return;

    try {
      const response = await fetch(
        `${API_ENDPOINTS.REJECT_ORDER}/${orderRequest.orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reject order: ${errorText}`);
      }

      setOrderRequest(null);
      toast.success("Order rejected");
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reject order"
      );
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await completeOrder(order!.id);
      setIsOrderAction(false);
      setDriverStatus("AVAILABLE");
      toast.success("Order completed successfully");
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete order"
      );
    }
  };

  const handleCancelOrder = async () => {
    if (!order) {
      toast.error("No active order to cancel");
      return;
    }

    toast.custom(
      (t) => (
        <div className="toast-overlay">
          <CancelOrderPrompt
            onSubmit={async (reason) => {
              try {
                toast.dismiss(t.id);
                const loadingToast = toast.loading("Cancelling order...");

                await cancelOrder(order?.id, reason);
                setIsOrderAction(false);
                toast.dismiss(loadingToast);
                setIsOrderAction(false);
                setDriverStatus("AVAILABLE");
                toast.success("Order cancelled successfully");
              } catch (error) {
                console.error("Error cancelling order:", error);
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Failed to cancel order"
                );
              }
            }}
            onCancel={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: Infinity,
        className: "centered-toast",
      }
    );
  };

    const handleRedirectToMaps = () => {
        if (!currentLocation || !order) {
            console.error("Current location or order request data is missing.");
            toast.error("Unable to open maps: Missing location data");
            return;
        }

        const { latitude, longitude } = currentLocation;
        const startLocation = encodeURIComponent(order.startLocation);
        const endLocation = encodeURIComponent(order.endLocation);

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${endLocation}&waypoints=${startLocation}`;

        window.open(mapsUrl, '_blank');
    };

  return (
    <div className="drivercontainer">
      <div id="drawer" className={`drawer ${isDrawerVisible ? "visible" : ""}`}>
        <div className="drawer-content">
          <button onClick={() => setIsDrawerVisible(false)}>
            <img src={back} alt="back" className="back-icon" />
          </button>
          <ul>
            <li onClick={() => navigate("/driver-payment")}>
              <img src={pay} alt="pay" className="pay-icon" />
              Payment
            </li>
            <li onClick={() => navigate("/support")}>
              <img src={support} alt="support" className="pay-icon" />
              Support
            </li>
            <li onClick={() => navigate("/about")}>
              <img src={about} alt="about" className="pay-icon" />
              About
            </li>
            <li onClick={handleLogout}>
              <img src={logoutIcon} alt="logout" className="pay-icon" />
              Logout
            </li>
          </ul>
        </div>
      </div>
      <div className="map-container">
        <div className="map-container">
          <Map
            currentLocation={currentLocation}
            onMapReady={setMap}
            defaultPosition={defaultPosition}
          />
        </div>

        <button
          onClick={() => setIsDrawerVisible(true)}
          className="drawer-menu-button"
        >
          <img src={menu} alt="menu" className="menu-icon" />
        </button>
      </div>
      <div className="button-bar">
        <button
          className="location-button-pass"
          onClick={handleMyLocationClick}
        >
          <img src={my_location} alt="expand" className="location-icon" />
        </button>
        <button className="online-toggle" onClick={handleToggleStatus}>
          {driverStatus === "OFFLINE" ? "Go Online" : "Go Offline"}
        </button>
        <div className="menu-wrapper">
          <div className={`expanded-menu ${isMenuVisible ? "visible" : ""}`}>
            <button className="menu-item">
              <img src={homeIcon} alt="home" className="home-icon" />
            </button>
            <button
              onClick={() =>
                navigate("/my-account-driver", { state: { driver } })
              }
              className="menu-item"
            >
              <img src={accountIcon} alt="account" className="account-icon" />
            </button>
            <button
              className="menu-item"
              onClick={() => navigate("/driver-rides-history")}
            >
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

      {orderRequest && (
        <div className="order-request-popup">
          <div className="order-request-card">
            <h3>New Ride Request</h3>
            <div className="order-details">
              <p>From: {orderRequest.startLocation}</p>
              <p>To: {orderRequest.endLocation}</p>
              <p>Estimated Price: ${orderRequest.estimatedPrice}</p>
              <p>Distance: {orderRequest.distance} km</p>
            </div>
            <div className="order-actions">
              <button className="accept-button" onClick={handleAcceptOrder}>
                Accept
              </button>
              <button className="reject-button" onClick={handleRejectOrder}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {orderAction && (
        <div className="order-action-popup">
          <div className="order-action-card">
            <button
              className="close-button"
              onClick={() => setIsOrderAction(false)}
            >
              ×
            </button>

            <div className="order-action-bar">
              <button
                className="complete-order-button"
                onClick={handleCompleteOrder}
              >
                Complete
              </button>
              <button
                className="cancel-order-button"
                onClick={handleCancelOrder}
              >
                Cancel
              </button>
            </div>
            <button
              className="go-to-maps-button"
              onClick={handleRedirectToMaps}
            >
              Go to Google Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverHomePage;
