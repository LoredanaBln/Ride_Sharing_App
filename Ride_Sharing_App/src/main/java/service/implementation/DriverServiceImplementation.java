package service.implementation;

import model.Driver;
import org.springframework.stereotype.Service;
import repository.DriverRepository;
import service.DriverService;
import single_point_access.RepositorySinglePointAccess;

import java.util.List;

@Service
public class DriverServiceImplementation implements DriverService {
    private final DriverRepository driverRepository = RepositorySinglePointAccess.driverRepository();

    @Override
    public Driver save(Driver driver) {
        return driverRepository.save(driver);
    }
    @Override
    public Driver update(Driver driver) {
        return driverRepository.update(driver);
    }

    @Override
    public List<Driver> findAll() {
        return driverRepository.findAll();
    }

    @Override
    public Driver findById(Integer id) {
        return driverRepository.findById(id);
    }

    @Override
    public boolean delete(Driver driver) {
        return driverRepository.delete(driver);
    }
}
