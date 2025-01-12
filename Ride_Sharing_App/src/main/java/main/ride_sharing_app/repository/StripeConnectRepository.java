package main.ride_sharing_app.repository;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.payment.StripeConnectAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;

import java.util.Optional;

@Repository
public interface StripeConnectRepository extends JpaRepository<StripeConnectAccount, Long> {
    Optional<StripeConnectAccount> findByDriver(Driver driver);
    Optional<StripeConnectAccount> findByDriverId(Long driverId);
    Optional<StripeConnectAccount> findByStripeConnectId(String stripeConnectId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM StripeConnectAccount s WHERE s.driver = :driver")
    Optional<StripeConnectAccount> findByDriverWithLock(@Param("driver") Driver driver);
} 