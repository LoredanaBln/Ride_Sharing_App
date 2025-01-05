package main.ride_sharing_app.service;

import main.ride_sharing_app.dto.OrderDTO;
import main.ride_sharing_app.model.*;
import main.ride_sharing_app.repository.OrderRepository;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class OrderService {
    private static final int MAX_DRIVER_ATTEMPTS = 5;
    private static final long DRIVER_ACCEPT_TIMEOUT_SECONDS = 30;
    
    private final OrderRepository orderRepository;
    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;

    public OrderService(OrderRepository orderRepository, 
                       DriverRepository driverRepository,
                       PassengerRepository passengerRepository) {
        this.orderRepository = orderRepository;
        this.driverRepository = driverRepository;
        this.passengerRepository = passengerRepository;
    }

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        Passenger passenger = passengerRepository.findById(orderDTO.getPassengerId())
            .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Order order = new Order();
        order.setPassenger(passenger);
        order.setStartLocation(orderDTO.getStartLocation());
        order.setEndLocation(orderDTO.getEndLocation());
        order.setStatus(OrderStatus.PENDING);
        order.setStartTime(LocalDateTime.now());
        order.setPaymentType(orderDTO.getPaymentType());
        order.setPrice(calculateEstimatedPrice(orderDTO));
        order.setEstimatedDistanceKm(calculateEstimatedDistance(
            orderDTO.getStartLatitude(), 
            orderDTO.getStartLongitude(),
            orderDTO.getEndLatitude(), 
            orderDTO.getEndLongitude()
        ));
        order.setEstimatedDurationMinutes(estimateDuration(order.getEstimatedDistanceKm()));

        // Save the initial order
        order = orderRepository.save(order);

        // Try to find an available driver with retries
        Driver assignedDriver = findAndAssignDriver(
            order,
            orderDTO.getStartLatitude(),
            orderDTO.getStartLongitude()
        );

        if (assignedDriver == null) {
            order.setStatus(OrderStatus.CANCELED);
            order.setCancellationReason("No available drivers found");
            return orderRepository.save(order);
        }

        return order;
    }

    private Double calculateEstimatedPrice(OrderDTO orderDTO) {
        double basePrice = 5.0;
        double distancePrice = calculateEstimatedDistance(
            orderDTO.getStartLatitude(), 
            orderDTO.getStartLongitude(),
            orderDTO.getEndLatitude(), 
            orderDTO.getEndLongitude()
        ) * 2.0; // $2 per km
        return basePrice + distancePrice;
    }

    private Double calculateEstimatedDistance(Double startLat, Double startLon, 
                                            Double endLat, Double endLon) {
        // Haversine formula for calculating distance between coordinates
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(endLat - startLat);
        double lonDistance = Math.toRadians(endLon - startLon);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(startLat)) * Math.cos(Math.toRadians(endLat))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    private Integer estimateDuration(Double distanceKm) {
        // Assuming average speed of 50 km/h in city
        return (int)(distanceKm * 6/5);
    }

    @Transactional
    public Order completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (order.getDriver() == null) {
            throw new RuntimeException("Cannot complete order: no driver assigned");
        }
        
        order.setStatus(OrderStatus.COMPLETED);
        order.setEndTime(LocalDateTime.now());
        order.setActualDurationMinutes(
            (int) ChronoUnit.MINUTES.between(order.getStartTime(), order.getEndTime())
        );
        
        Driver driver = order.getDriver();
        driver.setStatus("AVAILABLE");
        driverRepository.save(driver);
        
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(OrderStatus.CANCELED);
        order.setCancellationReason(reason);
        order.setEndTime(LocalDateTime.now());
        
        if (order.getDriver() != null) {
            Driver driver = order.getDriver();
            driver.setStatus("AVAILABLE");
            driverRepository.save(driver);
        }
        
        return orderRepository.save(order);
    }

    public List<Driver> findNearbyDrivers(Double latitude, Double longitude, Double radiusKm) {
        return driverRepository.findAll().stream()
            .filter(driver -> "AVAILABLE".equals(driver.getStatus()))
            .filter(driver -> isDriverWithinRadius(driver, latitude, longitude, radiusKm))
            .collect(Collectors.toList());
    }

    ///TODO IMPLEMENT ACTUAL LOGIC
    private boolean isDriverWithinRadius(Driver driver, Double latitude, 
                                       Double longitude, Double radiusKm) {
        return true; // Placeholder
    }

    public Order assignDriver(Long orderId, Long driverId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        order.setDriver(driver);
        order.setStatus(OrderStatus.ACCEPTED);
        
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        if (status == OrderStatus.COMPLETED) {
            order.setEndTime(LocalDateTime.now());
        }
        
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByPassenger(Long passengerId) {
        Passenger passenger = passengerRepository.findById(passengerId)
            .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return orderRepository.findByPassenger(passenger);
    }

    public List<Order> getOrdersByDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        return orderRepository.findByDriver(driver);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public void deleteOrder(Order order) {
        orderRepository.delete(order);
    }

    public void deleteOrderById(Long id) {
        orderRepository.deleteById(id);
    }

    private Driver findAndAssignDriver(Order order, Double latitude, Double longitude) {
        List<Driver> triedDrivers = new ArrayList<>();
        
        for (int attempt = 0; attempt < MAX_DRIVER_ATTEMPTS; attempt++) {
            Driver nextClosestDriver = findNextClosestDriver(latitude, longitude, triedDrivers);
            
            if (nextClosestDriver == null) {
                return null; // No more available drivers
            }

            // Try to assign this driver
            if (tryAssignDriver(order, nextClosestDriver)) {
                return nextClosestDriver;
            }

            // Add to tried drivers list if unsuccessful
            triedDrivers.add(nextClosestDriver);
        }

        return null;
    }

    private Driver findNextClosestDriver(Double latitude, Double longitude, List<Driver> excludeDrivers) {
        List<Driver> availableDrivers = driverRepository.findByStatus("AVAILABLE")
            .stream()
            .filter(driver -> !excludeDrivers.contains(driver))
            .toList();
        
        if (availableDrivers.isEmpty()) {
            return null;
        }

        Driver closestDriver = null;
        double minDistance = Double.MAX_VALUE;

        for (Driver driver : availableDrivers) {
            Double driverLat = driver.getLastLatitude();
            Double driverLon = driver.getLastLongitude();
            
            if (driverLat != null && driverLon != null) {
                double distance = calculateEstimatedDistance(
                    latitude, longitude, driverLat, driverLon
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDriver = driver;
                }
            }
        }

        return closestDriver;
    }

    private boolean tryAssignDriver(Order order, Driver driver) {
        // Set driver as pending for this order
        driver.setStatus("PENDING_ACCEPTANCE");
        driverRepository.save(driver);
        
        // Save the temporary assignment
        order.setDriver(driver);
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        // Wait for driver acceptance
        LocalDateTime timeout = LocalDateTime.now().plusSeconds(DRIVER_ACCEPT_TIMEOUT_SECONDS);
        
        while (LocalDateTime.now().isBefore(timeout)) {
            // Refresh order status from database
            Order currentOrder = orderRepository.findById(order.getId()).orElse(null);
            
            if (currentOrder != null) {
                if (currentOrder.getStatus() == OrderStatus.ACCEPTED) {
                    return true; // Driver accepted
                } else if (currentOrder.getStatus() == OrderStatus.REJECTED) {
                    // Reset driver status
                    driver.setStatus("AVAILABLE");
                    driverRepository.save(driver);
                    return false;
                }
            }
            
            try {
                Thread.sleep(1000); // Wait 1 second before checking again
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return false;
            }
        }

        // Timeout occurred
        driver.setStatus("AVAILABLE");
        driverRepository.save(driver);
        
        order.setDriver(null);
        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);
        
        return false;
    }

    // Add endpoint for driver to accept/reject order
    @Transactional
    public Order handleDriverResponse(Long orderId, Long driverId, boolean accepted) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (accepted) {
            order.setStatus(OrderStatus.ACCEPTED);
            order.setDriver(driver);
            driver.setStatus("BUSY");
        } else {
            order.setStatus(OrderStatus.REJECTED);
            order.setDriver(null);
            driver.setStatus("AVAILABLE");
        }

        driverRepository.save(driver);
        return orderRepository.save(order);
    }
}

