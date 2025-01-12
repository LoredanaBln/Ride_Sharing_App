package main.ride_sharing_app.model;

public enum OrderStatus {
    PENDING_ACCEPTANCE,  // Initial state when order is created and waiting for driver acceptance
    ACCEPTED,           // Driver has accepted the order
    IN_PROGRESS,        // Driver has started the ride
    COMPLETED,          // Ride is completed
    CANCELED,           // Order was canceled
    REJECTED            // Driver rejected the order
}