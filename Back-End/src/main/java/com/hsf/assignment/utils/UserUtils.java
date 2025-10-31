package com.hsf.assignment.utils;

import com.hsf.assignment.entity.User;
import com.hsf.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserUtils implements ApplicationContextAware {

    private static UserRepository userRepository;


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        userRepository = applicationContext.getBean(UserRepository.class);
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(username);
        return userRepository.findByUsername(username).get();
    }

}
