package repository.implementation;

import configuration.HibernateConfiguration;
import model.Driver;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import repository.DriverRepository;

import java.util.List;

public class DriverRepositoryImplementation implements DriverRepository {
    @Override
    public Driver save(Driver driver) {
        SessionFactory sessionFactory = HibernateConfiguration.getSessionFactory();
        Session session = sessionFactory.openSession();
        session.persist(driver);
        session.close();
        return driver;
    }

    @Override
    public Driver update(Driver driver) {
        return null;
    }

    @Override
    public Driver findById(Integer id) {
        return null;
    }

    @Override
    public List<Driver> findAll() {
        return null;
    }

    @Override
    public boolean delete(Driver driver) {
        return false;
    }
}
