import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassengerRides } from "../api/passengerGetOrders.ts";
import { AppDispatch, RootState } from "../store/store.ts";
import "../styles/passengerRidesHistory.css"

function PassengerRidesHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const { rides, loading, error } = useSelector(
    (state: RootState) => state.rides
  );

  useEffect(() => {
    dispatch(fetchPassengerRides());
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="history-container">
      <div className="rides-list">
        {rides.map((ride) => (
          <div key={ride.id} className="ride-item">
            <div className="ride-details">
              <p>
                <strong>From:</strong> {ride.startLocation}
              </p>
              <p>
                <strong>To:</strong> {ride.endLocation}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(ride.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Price:</strong> ${ride.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PassengerRidesHistory;
