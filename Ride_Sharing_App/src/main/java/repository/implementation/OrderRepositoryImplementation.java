package repository.implementation;

import model.Order;
import org.springframework.stereotype.Repository;
import repository.OrderRepository;

import java.util.List;

@Repository
public class OrderRepositoryImplementation implements OrderRepository {
    @Override
    public Order save(Order order) {
        return null;
    }

    @Override
    public Order update(Order order) {
        return null;
    }

    @Override
    public Order findById(Integer id) {
        return null;
    }

    @Override
    public List<Order> findAll() {
        return null;
    }

    @Override
    public boolean delete(Order order) {
        return false;
    }
}
