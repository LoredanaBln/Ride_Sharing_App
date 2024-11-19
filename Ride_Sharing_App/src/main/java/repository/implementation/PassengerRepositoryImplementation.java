package repository.implementation;

import model.Passenger;
import org.springframework.stereotype.Repository;
import repository.PassengerRepository;

import java.util.List;

@Repository
public class PassengerRepositoryImplementation implements PassengerRepository {
    @Override
    public Passenger save(Passenger entity) {
        return null;
    }

    @Override
    public Passenger update(Passenger entity) {
        return null;
    }

    @Override
    public List<Passenger> findAll() {
        return null;
    }

    @Override
    public boolean delete(Passenger entity) {
        return false;
    }

    @Override
    public Passenger findById(Integer id) {
        return null;
    }

    @Override
    public Passenger findByName(String name) {
        return null;
    }
}
