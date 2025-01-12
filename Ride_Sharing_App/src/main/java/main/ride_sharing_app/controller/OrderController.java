package main.ride_sharing_app.controller;

import main.ride_sharing_app.dto.OrderDTO;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.OrderStatus;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.service.OrderService;
import main.ride_sharing_app.security.JwtUtils;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PassengerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {
    private final OrderService orderService;
    private final JwtUtils jwtUtils;
    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;

    public OrderController(OrderService orderService, 
                         JwtUtils jwtUtils,
                         DriverRepository driverRepository,
                         PassengerRepository passengerRepository) {
        this.orderService = orderService;
        this.jwtUtils = jwtUtils;
        this.driverRepository = driverRepository;
        this.passengerRepository = passengerRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
        @RequestBody OrderDTO orderDTO,
        @RequestHeader("Authorization") String token) {
        
        // Get passenger email from JWT token
        String passengerEmail = jwtUtils.getUsernameFromToken(token.substring(7));
        
        // Find passenger by email
        Passenger passenger = passengerRepository.findByEmail(passengerEmail)
            .orElseThrow(() -> new RuntimeException("Passenger not found"));
            
        // Set the passenger ID in the DTO
        orderDTO.setPassengerId(passenger.getId());

        return ResponseEntity.ok(orderService.createOrder(orderDTO));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Order>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<Order>> getPassengerOrders(@PathVariable Long passengerId) {
        return ResponseEntity.ok(orderService.getOrdersByPassenger(passengerId));
    }

    @GetMapping("/passengerOrder")
    public ResponseEntity<?> getLoggedPassengerOrders(Authentication authentication) {
        try {
            if (authentication == null) {
                log.error("No authentication provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
            }

            String passengerEmail = authentication.getName();
            log.info("Fetching orders for passenger: {}", passengerEmail);

            Passenger passenger = passengerRepository.findByEmail(passengerEmail)
                    .orElseThrow(() -> new RuntimeException("Passenger not found: " + passengerEmail));

            List<Order> orders = orderService.getOrdersByPassenger(passenger.getId());
            log.info("Found {} orders for passenger {}", orders.size(), passengerEmail);

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("Error fetching passenger orders: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body("Error fetching orders: " + e.getMessage());
        }
    }

    @GetMapping("/driverOrder")
    public ResponseEntity<List<Order>> getLoggedDriverOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Driver driver = driverRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            List<Order> orders = orderService.getOrdersByDriver(driver.getId());
            System.out.println(orders);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Order>> getDriverOrders(@PathVariable Long driverId) {
        return ResponseEntity.ok(orderService.getOrdersByDriver(driverId));
    }

    @PutMapping("/{orderId}/assignDriver/{driverId}")
    public ResponseEntity<Order> assignDriver(
        @PathVariable Long orderId,
        @PathVariable Long driverId
    ) {
        return ResponseEntity.ok(orderService.assignDriver(orderId, driverId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
        @PathVariable Long orderId,
        @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/complete")
    public ResponseEntity<Order> completeOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.completeOrder(orderId));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
        @PathVariable Long orderId,
        @RequestParam String reason
    ) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, reason));
    }

    @GetMapping("/nearbyDrivers")
    public ResponseEntity<List<Driver>> findNearbyDrivers(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(defaultValue = "5.0") Double radiusKm
    ) {
        return ResponseEntity.ok(orderService.findNearbyDrivers(latitude, longitude, radiusKm));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        orderService.deleteOrderById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestBody Order order) {
        orderService.deleteOrder(order);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/accept/{orderId}")
    public ResponseEntity<?> acceptOrder(@PathVariable Long orderId, Authentication authentication) {
        try {
            String driverEmail = authentication.getName();
            log.info("Received accept request for order {} from driver {}", orderId, driverEmail);
            
            Order updatedOrder = orderService.acceptOrder(orderId, driverEmail);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            log.error("Error accepting order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reject/{orderId}")
    public ResponseEntity<?> rejectOrder(@PathVariable Long orderId, Authentication authentication) {
        try {
            String driverEmail = authentication.getName();
            Order updatedOrder = orderService.rejectOrder(orderId, driverEmail);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
