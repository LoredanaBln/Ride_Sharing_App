package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/order")
public class OrderController {
    OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> signUpPassenger(@RequestBody Order order) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(order));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Order>> getPassenger(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrderById(id));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Long id) {
        orderService.deleteOrderById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestBody Order order) {
        orderService.deleteOrder(order);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
