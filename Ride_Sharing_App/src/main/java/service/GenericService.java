package service;

import java.util.List;

public interface GenericService<T> {
    T save(T entity);

    T update(T entity);

    List<T> findAll();

    T findById(Integer id);

    boolean delete(T entity);

}
