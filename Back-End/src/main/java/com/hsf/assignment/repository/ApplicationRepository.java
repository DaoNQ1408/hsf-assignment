package com.hsf.assignment.repository;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    List<Application> findByAuthor(User author);

    List<Application> findByReceiver(User receiver);

}
