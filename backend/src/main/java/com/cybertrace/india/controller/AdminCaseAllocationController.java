package com.cybertrace.india.controller;

import com.cybertrace.india.dto.AdminReportSummaryResponse;
import com.cybertrace.india.dto.AssignCaseRequest;
import com.cybertrace.india.dto.AssignmentHistoryResponse;
import com.cybertrace.india.dto.CaseAssignmentResponse;
import com.cybertrace.india.service.AdminCaseAllocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminCaseAllocationController {

    private final AdminCaseAllocationService adminCaseAllocationService;

    public AdminCaseAllocationController(AdminCaseAllocationService adminCaseAllocationService) {
        this.adminCaseAllocationService = adminCaseAllocationService;
    }

    @GetMapping
    public ResponseEntity<List<AdminReportSummaryResponse>> getAllReports() {
        return ResponseEntity.ok(adminCaseAllocationService.getAllReports());
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<AdminReportSummaryResponse>> getUnassignedReports() {
        return ResponseEntity.ok(adminCaseAllocationService.getUnassignedReports());
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<AdminReportSummaryResponse>> getAssignedReports() {
        return ResponseEntity.ok(adminCaseAllocationService.getAssignedReports());
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<AdminReportSummaryResponse> getReportDetails(@PathVariable Long reportId) {
        return ResponseEntity.ok(adminCaseAllocationService.getReportDetails(reportId));
    }

    @PostMapping("/{reportId}/assign")
    public ResponseEntity<CaseAssignmentResponse> assignReport(
            Authentication authentication,
            @PathVariable Long reportId,
            @Valid @RequestBody AssignCaseRequest request) {
        CaseAssignmentResponse response = adminCaseAllocationService.assignReport(
                authentication.getName(), reportId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{reportId}/reassign")
    public ResponseEntity<CaseAssignmentResponse> reassignReport(
            Authentication authentication,
            @PathVariable Long reportId,
            @Valid @RequestBody AssignCaseRequest request) {
        return ResponseEntity.ok(adminCaseAllocationService.reassignReport(
                authentication.getName(), reportId, request));
    }

    @GetMapping("/{reportId}/assignment-history")
    public ResponseEntity<List<AssignmentHistoryResponse>> getAssignmentHistory(@PathVariable Long reportId) {
        return ResponseEntity.ok(adminCaseAllocationService.getAssignmentHistory(reportId));
    }
}
