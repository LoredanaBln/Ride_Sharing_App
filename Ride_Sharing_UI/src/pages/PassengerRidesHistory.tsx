import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassengerRides } from "../api/passengerGetOrders";
import { AppDispatch, RootState } from "../store/store";
import "../styles/passengerRidesHistory.css";
import { motion } from "framer-motion";

function PassengerRidesHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const { rides, loading, error } = useSelector(
    (state: RootState) => state.rides
  );

  useEffect(() => {
    dispatch(fetchPassengerRides());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="history-container"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="history-header"
      >
        <h1>My Rides</h1>
        <p className="subtitle">Your journey history</p>
      </motion.div>
      <div className="rides-list">
        {rides.map((ride, index) => (
          <motion.div
            key={ride.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ride-item"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/*<div className="ride-status">*/}
            {/*  <span className={`status-badge ${ride.status?.toLowerCase()}`}>*/}
            {/*    {ride.status || "Completed"}*/}
            {/*  </span>*/}
            {/*</div>*/}
            <div className="ride-details">
              <div className="location-group">
                <p className="location">
                  <i className="fas fa-map-marker-alt start-icon"></i>
                  <span>{ride.startLocation}</span>
                </p>
                <div className="location-divider"></div>
                <p className="location">
                  <i className="fas fa-map-marker-alt end-icon"></i>
                  <span>{ride.endLocation}</span>
                </p>
              </div>
              <div className="ride-info">
                <p>
                  <i className="far fa-calendar"></i>
                  {new Date(ride.date).toLocaleDateString()}
                </p>
                <p className="price">
                  <i className="fas fa-dollar-sign"></i>
                  {Number(ride.price).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PassengerRidesHistory;
