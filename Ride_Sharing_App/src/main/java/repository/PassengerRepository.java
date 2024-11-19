package repository;

import model.Passenger;

public interface PassengerRepository extends CrudRepository<Passenger, Integer>{
    Passenger findById(Integer id);
    Passenger findByName(String name);
}
