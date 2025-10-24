package com.hsf.assignment.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface CustomerUserDetailsService extends UserDetailsService {
    UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException;
}
