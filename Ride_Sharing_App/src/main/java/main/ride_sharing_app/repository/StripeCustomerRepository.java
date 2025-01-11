package main.ride_sharing_app.repository;

import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.model.payment.StripeCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StripeCustomerRepository extends JpaRepository<StripeCustomer, Long> {
    Optional<StripeCustomer> findByPassenger(Passenger passenger);
    Optional<StripeCustomer> findByStripeCustomerId(String stripeCustomerId);
} 