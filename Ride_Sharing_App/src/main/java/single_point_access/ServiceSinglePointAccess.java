package single_point_access;

import repository.PassengerRepository;
import repository.implementation.PassengerRepositoryImplementation;
import service.DriverService;
import service.OrderService;
import service.implementation.DriverServiceImplementation;
import service.implementation.OrderServiceImplementation;

public class ServiceSinglePointAccess {

    private static DriverService driverService;
    private static OrderService orderService;
    private static PassengerRepository passengerRepository;

    static {
        driverService = new DriverServiceImplementation();
        orderService = new OrderServiceImplementation();
        passengerRepository = new PassengerRepositoryImplementation();
    }

    public static DriverService driverService() {
        return driverService;
    }

    public static OrderService orderService() {
        return orderService;
    }

    public static PassengerRepository passengerRepository() {
        return passengerRepository;
    }
}
