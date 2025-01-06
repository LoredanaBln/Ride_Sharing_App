package main.ride_sharing_app.model;

public enum DriverStatus {
    AVAILABLE,      // Ready to accept orders
    BUSY,          // Currently on a ride
    OFFLINE,       // Not available
    PENDING_ACCEPTANCE  // Temporarily unavailable while deciding on an order
} 