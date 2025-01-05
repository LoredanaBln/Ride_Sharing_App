package main.ride_sharing_app.model;

public enum OrderStatus {
    PENDING,           // Initial state when order is created
    PENDING_DRIVER,    // Waiting for driver to accept/reject
    DRIVER_TIMEOUT,    // Driver didn't respond in time
    ACCEPTED,          // Driver accepted the order
    REJECTED,          // Driver rejected the order
    IN_PROGRESS,       // Driver picked up passenger
    COMPLETED,         // Ride completed
    CANCELED           // Order was canceled
}