package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.repository.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingService {
    private final OrderService orderService;
    private final DriverRepository driverRepository;

    public RatingService(OrderService orderService, DriverRepository driverRepository) {
        this.orderService = orderService;
        this.driverRepository = driverRepository;
    }

    @Transactional
    public void rateDriver(Long orderId, int rating, String passengerEmail) {
        Order order = orderService.getOrderById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
            
        // Verify the passenger is the one who made the order
        if (!order.getPassenger().getEmail().equals(passengerEmail)) {
            throw new RuntimeException("Unauthorized to rate this ride");
        }
        
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        Driver driver = order.getDriver();
        if (driver == null) {
            throw new RuntimeException("No driver assigned to this order");
        }
        
        // Update driver's rating
        double currentRating = driver.getRating() != null ? driver.getRating() : 0;
        int totalRatings = driver.getTotalRatings() != null ? driver.getTotalRatings() : 0;
        
        double newRating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
        driver.setRating(newRating);
        driver.setTotalRatings(totalRatings + 1);
        
        driverRepository.save(driver);
    }
} 