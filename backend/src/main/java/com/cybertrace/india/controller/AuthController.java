package com.cybertrace.india.controller;

import com.cybertrace.india.dto.AuthResponse;
import com.cybertrace.india.dto.LoginRequest;
import com.cybertrace.india.dto.RegisterRequest;
import com.cybertrace.india.dto.UserSummaryResponse;
import com.cybertrace.india.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerCitizen(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryResponse> getCurrentUser(Authentication authentication) {
        UserSummaryResponse summary = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        SecurityContextHolder.clearContext();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Logged out successfully. Please discard your access token.");
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(body);
    }
}
