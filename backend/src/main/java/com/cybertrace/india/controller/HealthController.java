package com.cybertrace.india.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "cybertrace-backend");
        response.put("timestamp", Instant.now().toString());

        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            response.put("database", valid ? "UP" : "DOWN");
        } catch (Exception ex) {
            response.put("database", "DOWN");
            response.put("databaseError", ex.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
