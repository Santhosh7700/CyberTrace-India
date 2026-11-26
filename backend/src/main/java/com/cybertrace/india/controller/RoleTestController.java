package com.cybertrace.india.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Temporary verification endpoints for role-based authorization testing.
 */
@RestController
public class RoleTestController {

    @GetMapping("/api/citizen/test")
    public ResponseEntity<Map<String, Object>> citizenTest(Authentication authentication) {
        return ResponseEntity.ok(buildResponse("CITIZEN", authentication.getName()));
    }

    @GetMapping("/api/investigator/test")
    public ResponseEntity<Map<String, Object>> investigatorTest(Authentication authentication) {
        return ResponseEntity.ok(buildResponse("INVESTIGATOR", authentication.getName()));
    }

    @GetMapping("/api/admin/test")
    public ResponseEntity<Map<String, Object>> adminTest(Authentication authentication) {
        return ResponseEntity.ok(buildResponse("ADMIN", authentication.getName()));
    }

    private Map<String, Object> buildResponse(String role, String email) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "OK");
        body.put("role", role);
        body.put("email", email);
        return body;
    }
}
