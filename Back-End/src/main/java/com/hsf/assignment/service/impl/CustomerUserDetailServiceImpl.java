package com.hsf.assignment.service.impl;

import com.hsf.assignment.service.CustomerUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailServiceImpl implements CustomerUserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        throw new UsernameNotFoundException(identifier);
    }
}
