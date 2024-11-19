package service.implementation;

import model.Order;
import org.springframework.stereotype.Service;
import repository.OrderRepository;
import repository.implementation.OrderRepositoryImplementation;
import service.OrderService;
import single_point_access.RepositorySinglePointAccess;

import java.util.List;

@Service
public class OrderServiceImplementation implements OrderService {
    OrderRepository orderRepository = RepositorySinglePointAccess.orderRepository();

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order update(Order order) {
        return orderRepository.update(order);
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order findById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    public boolean delete(Order order) {
        return orderRepository.delete(order);
    }
}
