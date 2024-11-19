package single_point_access;

import repository.DriverRepository;
import repository.OrderRepository;
import repository.PassengerRepository;
import repository.implementation.DriverRepositoryImplementation;
import repository.implementation.OrderRepositoryImplementation;
import repository.implementation.PassengerRepositoryImplementation;

public record RepositorySinglePointAccess(
        DriverRepository driverRepository,
        OrderRepository orderRepository,
        PassengerRepository passengerRepository
) {
    private static final RepositorySinglePointAccess INSTANCE = new RepositorySinglePointAccess(
            new DriverRepositoryImplementation(),
            new OrderRepositoryImplementation(),
            new PassengerRepositoryImplementation()
    );

    public static RepositorySinglePointAccess getInstance() {
        return INSTANCE;
    }
}
