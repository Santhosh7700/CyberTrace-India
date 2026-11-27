package com.cybertrace.india.controller;

import com.cybertrace.india.dto.CreateScamReportRequest;
import com.cybertrace.india.dto.ScamReportResponse;
import com.cybertrace.india.service.CitizenReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen/reports")
public class CitizenReportController {

    private final CitizenReportService citizenReportService;

    public CitizenReportController(CitizenReportService citizenReportService) {
        this.citizenReportService = citizenReportService;
    }

    @PostMapping
    public ResponseEntity<ScamReportResponse> submitReport(
            Authentication authentication,
            @Valid @RequestBody CreateScamReportRequest request) {
        ScamReportResponse response = citizenReportService.createReport(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ScamReportResponse>> getMyReports(Authentication authentication) {
        return ResponseEntity.ok(citizenReportService.getMyReports(authentication.getName()));
    }

    @GetMapping("/{reportId:\\d+}")
    public ResponseEntity<ScamReportResponse> getMyReportById(
            Authentication authentication,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(citizenReportService.getMyReportById(authentication.getName(), reportId));
    }

    @GetMapping("/reference/{caseReference}")
    public ResponseEntity<ScamReportResponse> getMyReportByReference(
            Authentication authentication,
            @PathVariable String caseReference) {
        return ResponseEntity.ok(citizenReportService.getMyReportByReference(authentication.getName(), caseReference));
    }
}
