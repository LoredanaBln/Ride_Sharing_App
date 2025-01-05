package main.ride_sharing_app.repository;

import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.OrderStatus;
import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByPassenger(Passenger passenger);
    List<Order> findByDriver(Driver driver);
    List<Order> findByStatus(OrderStatus status);
}
