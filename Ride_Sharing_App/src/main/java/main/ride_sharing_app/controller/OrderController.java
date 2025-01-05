package main.ride_sharing_app.controller;

import main.ride_sharing_app.dto.OrderDTO;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.OrderStatus;
import main.ride_sharing_app.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
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
}
