package com.hsf.assignment.service.impl;

import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import com.hsf.assignment.entity.User;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    private final UserRepository userRepository;
    @Value("${TOKEN_SECRET_KEY}")
    private String TOKEN_SECRET_KEY;

    public JwtServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private SecretKey getSigninKey() {
        return Keys.hmacShaKeyFor(TOKEN_SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }


    @Override
    public String generateToken(User user) {
        String token = Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .claim("role", user.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigninKey())
                .compact();
        return token;
    }

    @Override
    public User getUserByToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String idString = claims.getSubject();
        long id = Long.parseLong(idString);

        User user = userRepository.findByUserId(id);
        return user;
    }
}
