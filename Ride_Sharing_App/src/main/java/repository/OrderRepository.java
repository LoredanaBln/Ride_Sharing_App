package repository;

import model.Order;

public interface OrderRepository extends CrudRepository<Order, Integer>{
        Order findById(Integer id);
}
