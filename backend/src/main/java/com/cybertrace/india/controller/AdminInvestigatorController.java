package com.cybertrace.india.controller;

import com.cybertrace.india.dto.CreateInvestigatorRequest;
import com.cybertrace.india.dto.InvestigatorResponse;
import com.cybertrace.india.dto.UpdateInvestigatorRequest;
import com.cybertrace.india.dto.UpdateInvestigatorStatusRequest;
import com.cybertrace.india.service.AdminInvestigatorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/investigators")
public class AdminInvestigatorController {

    private final AdminInvestigatorService adminInvestigatorService;

    public AdminInvestigatorController(AdminInvestigatorService adminInvestigatorService) {
        this.adminInvestigatorService = adminInvestigatorService;
    }

    @PostMapping
    public ResponseEntity<InvestigatorResponse> createInvestigator(
            @Valid @RequestBody CreateInvestigatorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminInvestigatorService.createInvestigator(request));
    }

    @GetMapping
    public ResponseEntity<List<InvestigatorResponse>> listInvestigators() {
        return ResponseEntity.ok(adminInvestigatorService.listInvestigators());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestigatorResponse> getInvestigator(@PathVariable Long id) {
        return ResponseEntity.ok(adminInvestigatorService.getInvestigator(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestigatorResponse> updateInvestigator(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvestigatorRequest request) {
        return ResponseEntity.ok(adminInvestigatorService.updateInvestigator(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InvestigatorResponse> updateInvestigatorStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvestigatorStatusRequest request) {
        return ResponseEntity.ok(adminInvestigatorService.updateInvestigatorStatus(id, request));
    }
}
