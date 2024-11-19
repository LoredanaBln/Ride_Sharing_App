package service.implementation;

import model.Passenger;
import repository.PassengerRepository;
import service.PassengerService;
import single_point_access.RepositorySinglePointAccess;

import java.util.List;

public class PassengerServiceImplementation implements PassengerService {
    PassengerRepository passengerRepository = RepositorySinglePointAccess.passengerRepository();

    @Override
    public Passenger save(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    @Override
    public Passenger update(Passenger passenger) {
        return passengerRepository.update(passenger);
    }

    @Override
    public List<Passenger> findAll() {
        return passengerRepository.findAll();
    }

    @Override
    public Passenger findById(Integer id) {
        return passengerRepository.findById(id);
    }

    @Override
    public boolean delete(Passenger passenger) {
        return passengerRepository.delete(passenger);
    }
}
