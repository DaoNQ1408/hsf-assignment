package com.hsf.assignment.repository;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {

}
