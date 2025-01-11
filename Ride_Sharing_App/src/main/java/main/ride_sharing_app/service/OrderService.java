package main.ride_sharing_app.service;

import main.ride_sharing_app.dto.OrderDTO;
import main.ride_sharing_app.model.*;
import main.ride_sharing_app.model.location.GeoLocation;
import main.ride_sharing_app.model.location.RouteInfo;
import main.ride_sharing_app.model.payment.PaymentStatus;
import main.ride_sharing_app.repository.OrderRepository;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PassengerRepository;
import main.ride_sharing_app.websocket.controller.LocationWebSocketController;
import main.ride_sharing_app.websocket.controller.OrderNotificationController;
import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;
import main.ride_sharing_app.websocket.dto.LocationUpdateDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


@Service
public class OrderService {
    private static final int MAX_DRIVER_ATTEMPTS = 5;
    private static final long DRIVER_ACCEPT_TIMEOUT_SECONDS = 30;
    
    private final OrderRepository orderRepository;
    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;
    private final LocationService locationService;
    private final ScheduledExecutorService scheduledExecutorService;
    private final OrderNotificationController notificationController;
    private final LocationWebSocketController locationController;
    private final PaymentService paymentService;

    public OrderService(OrderRepository orderRepository, 
                       DriverRepository driverRepository,
                       PassengerRepository passengerRepository,
                       LocationService locationService,
                       ScheduledExecutorService scheduledExecutorService,
                       OrderNotificationController notificationController,
                       LocationWebSocketController locationController,
                       PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.driverRepository = driverRepository;
        this.passengerRepository = passengerRepository;
        this.locationService = locationService;
        this.scheduledExecutorService = scheduledExecutorService;
        this.notificationController = notificationController;
        this.locationController = locationController;
        this.paymentService = paymentService;
    }

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        // Calculate estimated price first
        double estimatedPrice = calculateEstimatedPrice(orderDTO);

        Passenger passenger = passengerRepository.findById(orderDTO.getPassengerId())
            .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Order order = new Order();
        order.setPassenger(passenger);
        order.setStartLocation(orderDTO.getStartLocation());
        order.setEndLocation(orderDTO.getEndLocation());
        order.setStatus(OrderStatus.PENDING);
        order.setStartTime(LocalDateTime.now());
        order.setPaymentType(orderDTO.getPaymentType());
        order.setPrice(estimatedPrice);
        order.setPaymentStatus(PaymentStatus.PENDING);

        // Get route information
        GeoLocation startLocation = new GeoLocation(
            orderDTO.getStartLatitude(),
            orderDTO.getStartLongitude()
        );
        GeoLocation endLocation = new GeoLocation(
            orderDTO.getEndLatitude(),
            orderDTO.getEndLongitude()
        );
        
        RouteInfo routeInfo = locationService.getRoute(startLocation, endLocation);
        
        order.setEstimatedDistanceKm(routeInfo.getDistanceInKm());
        order.setEstimatedDurationMinutes(routeInfo.getDurationInMinutes());

        // Create payment intent but don't confirm
        try {
            PaymentIntent intent = paymentService.createPaymentIntent(order);
            order.setPaymentIntentId(intent.getId());
            order.setPaymentStatus(PaymentStatus.PENDING);
        } catch (StripeException e) {
            throw new RuntimeException("Payment setup failed: " + e.getMessage());
        }

        // Save the initial order
        order = orderRepository.save(order);

        // Notify nearby drivers about new order
        List<Driver> nearbyDrivers = findNearbyDrivers(
            orderDTO.getStartLatitude(),
            orderDTO.getStartLongitude(),
            5.0 // 5km radius
        );
        
        OrderNotificationDTO notification = new OrderNotificationDTO(
            order.getId(),
            OrderStatus.PENDING.toString(),
            "New ride request",
            System.currentTimeMillis()
        );
        
        notificationController.notifyNearbyDrivers(
            notification,
            nearbyDrivers.stream()
                .map(Driver::getId)
                .collect(Collectors.toList())
        );

        // Try to find an available driver
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

        // Schedule a timeout task instead of polling
        Order finalOrder = order;
        scheduledExecutorService.schedule(() -> {
            checkOrderTimeout(finalOrder.getId());
        }, DRIVER_ACCEPT_TIMEOUT_SECONDS, TimeUnit.SECONDS);

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
        driver.setStatus(DriverStatus.AVAILABLE);
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
            driver.setStatus(DriverStatus.AVAILABLE);
            driverRepository.save(driver);
        }
        
        return orderRepository.save(order);
    }

    public List<Driver> findNearbyDrivers(Double latitude, Double longitude, Double radiusKm) {
        return driverRepository.findAll().stream()
            .filter(driver -> DriverStatus.AVAILABLE.equals(driver.getStatus())
                && isDriverLoggedIn(driver.getEmail()))
            .filter(driver -> isDriverWithinRadius(driver, latitude, longitude, radiusKm))
            .collect(Collectors.toList());
    }

    ///TODO IMPLEMENT ACTUAL LOGIC
    private boolean isDriverWithinRadius(Driver driver, Double latitude, 
                                       Double longitude, Double radiusKm) {
        if (driver.getLastLatitude() == null || driver.getLastLongitude() == null) {
            return false;
        }

        GeoLocation driverLocation = new GeoLocation(
            driver.getLastLatitude(),
            driver.getLastLongitude()
        );
        GeoLocation requestLocation = new GeoLocation(latitude, longitude);
        
        RouteInfo route = locationService.getRoute(driverLocation, requestLocation);
        return route.getDistanceInKm() <= radiusKm;
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

    public List<Order> getOrdersByPassengerEmail(String email) {
        Passenger passenger = passengerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return orderRepository.findByPassenger(passenger);
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
        List<Driver> availableDrivers = driverRepository.findByStatus(DriverStatus.AVAILABLE)
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

    @Async
    protected boolean tryAssignDriver(Order order, Driver driver) {
        // Set driver as pending for this order
        driver.setStatus(DriverStatus.PENDING_ACCEPTANCE);
        driverRepository.save(driver);
        
        // Save the temporary assignment
        order.setDriver(driver);
        order.setStatus(OrderStatus.PENDING_DRIVER);
        Order savedOrder = orderRepository.save(order);
        
        // Return the order immediately so the client isn't blocked
        return true;
    }

    @Transactional
    public void checkOrderTimeout(Long orderId) {
        orderRepository.findById(orderId).ifPresent(order -> {
            if (order.getStatus() == OrderStatus.PENDING_DRIVER) {
                Driver driver = order.getDriver();
                if (driver != null) {
                    driver.setStatus(DriverStatus.AVAILABLE);
                    driverRepository.save(driver);
                }
                order.setDriver(null);
                order.setStatus(OrderStatus.DRIVER_TIMEOUT);
                orderRepository.save(order);
            }
        });
    }

    // Add endpoint for driver to accept/reject order
    @Transactional
    public Order handleDriverResponse(Long orderId, Long driverId, boolean accepted) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (accepted) {
            try {
                // Confirm the payment when driver accepts
                paymentService.confirmPayment(order);
                order.setPaymentStatus(PaymentStatus.COMPLETED);
            } catch (StripeException e) {
                order.setPaymentStatus(PaymentStatus.FAILED);
                throw new RuntimeException("Payment failed: " + e.getMessage());
            }

            order.setStatus(OrderStatus.ACCEPTED);
            order.setDriver(driver);
            driver.setStatus(DriverStatus.BUSY);
        } else {
            order.setStatus(OrderStatus.REJECTED);
            order.setDriver(null);
            driver.setStatus(DriverStatus.AVAILABLE);
        }

        driverRepository.save(driver);
        Order savedOrder = orderRepository.save(order);

        // Notify passenger about driver's response
        OrderNotificationDTO notification = new OrderNotificationDTO(
            orderId,
            savedOrder.getStatus().toString(),
            accepted ? "Driver accepted your ride" : "Driver rejected your ride",
            System.currentTimeMillis()
        );
        notificationController.handleOrderNotification(orderId, notification);

        return savedOrder;
    }

    private boolean isDriverLoggedIn(String email) {
        try {
            // Check if there's a valid authentication context
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) auth.getPrincipal();
                return userDetails.getUsername().equals(email) 
                    && userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_DRIVER"));
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void updateDriverLocation(Long driverId, Long orderId, Double latitude, Double longitude) {
        LocationUpdateDTO locationUpdate = new LocationUpdateDTO(
            driverId,
            orderId,
            latitude,
            longitude,
            System.currentTimeMillis()
        );
        locationController.handleLocationUpdate(driverId, locationUpdate);

        // Update driver's last known location
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setLastLatitude(latitude);
        driver.setLastLongitude(longitude);
        driver.setLocationUpdatedAt(LocalDateTime.now());
        driverRepository.save(driver);
    }
}

