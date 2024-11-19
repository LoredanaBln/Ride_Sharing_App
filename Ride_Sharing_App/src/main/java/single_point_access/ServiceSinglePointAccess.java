package single_point_access;

import repository.PassengerRepository;
import repository.implementation.PassengerRepositoryImplementation;
import service.DriverService;
import service.OrderService;
import service.implementation.DriverServiceImplementation;
import service.implementation.OrderServiceImplementation;

public record ServiceSinglePointAccess(
        DriverService driverService,
        OrderService orderService,
        PassengerRepository passengerRepository
) {
    private static final ServiceSinglePointAccess INSTANCE = new ServiceSinglePointAccess(
            new DriverServiceImplementation(),
            new OrderServiceImplementation(),
            new PassengerRepositoryImplementation()
    );

    public static ServiceSinglePointAccess getInstance() {
        return INSTANCE;
    }
}
