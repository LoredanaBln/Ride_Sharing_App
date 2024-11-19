package single_point_access;

import repository.DriverRepository;
import repository.OrderRepository;
import repository.PassengerRepository;
import repository.implementation.DriverRepositoryImplementation;
import repository.implementation.OrderRepositoryImplementation;
import repository.implementation.PassengerRepositoryImplementation;

public class RepositorySinglePointAccess {

    private static DriverRepository driverRepository;
    private static OrderRepository orderRepository;
    private static PassengerRepository passengerRepository;

    static{
        driverRepository = new DriverRepositoryImplementation();
        orderRepository = new OrderRepositoryImplementation();
        passengerRepository = new PassengerRepositoryImplementation();
    }

    public static DriverRepository driverRepository() {
        return driverRepository;
    }

    public static OrderRepository orderRepository() {
        return orderRepository;
    }

    public static PassengerRepository passengerRepository() {
        return passengerRepository;
    }
}