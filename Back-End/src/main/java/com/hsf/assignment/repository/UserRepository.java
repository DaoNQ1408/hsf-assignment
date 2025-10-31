package com.hsf.assignment.repository;

import com.hsf.assignment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByUserId(Long userId);
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
    User findByPhone(String phone);
    List<User> findByRole(String role);
    List<User> findByStatus(String status);
    List<User> findAllByStatus(String status);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.phone = :phone WHERE u.userId = :id")
    int updatePhone(Long id, String phone);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.userId = :id")
    int updateEmail(Long id, String email);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = :password WHERE u.userId = :id")
    int updatePassword(Long id, String password);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.userId = :id")
    int updateStatus(Long id, String status);
}
