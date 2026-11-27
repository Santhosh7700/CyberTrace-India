package com.cybertrace.india.service;

import com.cybertrace.india.dto.AdminReportSummaryResponse;
import com.cybertrace.india.dto.AssignCaseRequest;
import com.cybertrace.india.dto.AssignmentHistoryResponse;
import com.cybertrace.india.dto.CaseAssignmentResponse;
import com.cybertrace.india.entity.AssignmentHistory;
import com.cybertrace.india.entity.CaseActivityLog;
import com.cybertrace.india.entity.CaseAssignment;
import com.cybertrace.india.entity.InvestigatorProfile;
import com.cybertrace.india.entity.ScamReport;
import com.cybertrace.india.entity.User;
import com.cybertrace.india.exception.BadRequestException;
import com.cybertrace.india.exception.ResourceNotFoundException;
import com.cybertrace.india.repository.AssignmentHistoryRepository;
import com.cybertrace.india.repository.CaseActivityLogRepository;
import com.cybertrace.india.repository.CaseAssignmentRepository;
import com.cybertrace.india.repository.InvestigatorProfileRepository;
import com.cybertrace.india.repository.ScamReportRepository;
import com.cybertrace.india.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AdminCaseAllocationService {

    private final ScamReportRepository scamReportRepository;
    private final InvestigatorProfileRepository investigatorProfileRepository;
    private final CaseAssignmentRepository caseAssignmentRepository;
    private final AssignmentHistoryRepository assignmentHistoryRepository;
    private final CaseActivityLogRepository caseActivityLogRepository;
    private final UserRepository userRepository;

    public AdminCaseAllocationService(
            ScamReportRepository scamReportRepository,
            InvestigatorProfileRepository investigatorProfileRepository,
            CaseAssignmentRepository caseAssignmentRepository,
            AssignmentHistoryRepository assignmentHistoryRepository,
            CaseActivityLogRepository caseActivityLogRepository,
            UserRepository userRepository) {
        this.scamReportRepository = scamReportRepository;
        this.investigatorProfileRepository = investigatorProfileRepository;
        this.caseAssignmentRepository = caseAssignmentRepository;
        this.assignmentHistoryRepository = assignmentHistoryRepository;
        this.caseActivityLogRepository = caseActivityLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminReportSummaryResponse> getAllReports() {
        List<ScamReport> reports = scamReportRepository.findAllByOrderBySubmittedAtDesc();
        Map<Long, CaseAssignment> assignmentByReportId = loadAssignmentsByReportId(reports);
        return reports.stream()
                .map(report -> toReportSummary(report, assignmentByReportId.get(report.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminReportSummaryResponse> getUnassignedReports() {
        return scamReportRepository.findUnassignedReportsOrderBySubmittedAtDesc().stream()
                .map(report -> toReportSummary(report, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminReportSummaryResponse> getAssignedReports() {
        List<ScamReport> reports = scamReportRepository.findAssignedReportsOrderBySubmittedAtDesc();
        Map<Long, CaseAssignment> assignmentByReportId = loadAssignmentsByReportId(reports);
        return reports.stream()
                .map(report -> toReportSummary(report, assignmentByReportId.get(report.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminReportSummaryResponse getReportDetails(Long reportId) {
        ScamReport report = scamReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));
        CaseAssignment assignment = caseAssignmentRepository.findByReportId(reportId).orElse(null);
        return toReportSummary(report, assignment);
    }

    @Transactional
    public CaseAssignmentResponse assignReport(String adminEmail, Long reportId, AssignCaseRequest request) {
        User admin = resolveAdminUser(adminEmail);
        ScamReport report = scamReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));

        if (caseAssignmentRepository.findByReportId(reportId).isPresent()) {
            throw new BadRequestException("Report is already assigned. Use reassign endpoint instead.");
        }

        InvestigatorProfile investigator = validateEligibleInvestigator(request.getInvestigatorId());

        CaseAssignment assignment = new CaseAssignment();
        assignment.setReport(report);
        assignment.setInvestigator(investigator);
        assignment.setAssignedByAdmin(admin);
        assignment.setAssignmentStatus("ACTIVE");
        CaseAssignment savedAssignment;
        try {
            savedAssignment = caseAssignmentRepository.saveAndFlush(assignment);
        } catch (DataIntegrityViolationException ex) {
            // Only translate unique constraint violation on case_assignments.report_id into a
            // duplicate-assignment error. All other DataIntegrityViolationExceptions are
            // re-thrown so they propagate as generic database errors (e.g. 500).
            Throwable root = ex.getRootCause();
            if (root != null && root.getMessage() != null
                    && root.getMessage().contains("case_assignments_report_id_key")) {
                throw new BadRequestException("Report is already assigned. Use reassign endpoint instead.");
            }
            throw ex;
        }

        if ("SUBMITTED".equals(report.getStatus())) {
            report.setStatus("UNDER_REVIEW");
            report.setUpdatedAt(OffsetDateTime.now());
            scamReportRepository.save(report);
        }

        recordHistory(report, null, investigator, admin, "INITIAL_ASSIGNMENT", request.getNotes());
        recordActivity(report, admin, "CASE_ASSIGNED",
                "Case assigned to investigator " + investigator.getDisplayName() + " (" + investigator.getCyberId() + ")");

        return toAssignmentResponse(savedAssignment);
    }

    @Transactional
    public CaseAssignmentResponse reassignReport(String adminEmail, Long reportId, AssignCaseRequest request) {
        User admin = resolveAdminUser(adminEmail);
        ScamReport report = scamReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));

        CaseAssignment existingAssignment = caseAssignmentRepository.findByReportId(reportId)
                .orElseThrow(() -> new BadRequestException("Report is not currently assigned. Use assign endpoint first."));

        InvestigatorProfile previousInvestigator = existingAssignment.getInvestigator();
        InvestigatorProfile newInvestigator = validateEligibleInvestigator(request.getInvestigatorId());

        if (previousInvestigator.getId().equals(newInvestigator.getId())) {
            throw new BadRequestException("Report is already assigned to this investigator");
        }

        existingAssignment.setInvestigator(newInvestigator);
        existingAssignment.setAssignedByAdmin(admin);
        existingAssignment.setAssignmentStatus("ACTIVE");
        CaseAssignment savedAssignment = caseAssignmentRepository.save(existingAssignment);

        recordHistory(report, previousInvestigator, newInvestigator, admin, "REASSIGNMENT", request.getNotes());
        recordActivity(report, admin, "CASE_REASSIGNED",
                "Case reassigned from " + previousInvestigator.getDisplayName()
                        + " to " + newInvestigator.getDisplayName() + " (" + newInvestigator.getCyberId() + ")");

        return toAssignmentResponse(savedAssignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentHistoryResponse> getAssignmentHistory(Long reportId) {
        if (!scamReportRepository.existsById(reportId)) {
            throw new ResourceNotFoundException("Scam report not found");
        }
        return assignmentHistoryRepository.findByReportIdOrderByAssignedAtDesc(reportId).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private User resolveAdminUser(String adminEmail) {
        return userRepository.findByEmailIgnoreCase(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
    }

    private InvestigatorProfile validateEligibleInvestigator(Long investigatorId) {
        InvestigatorProfile investigator = investigatorProfileRepository.findById(investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investigator not found"));

        User invUser = investigator.getUser();
        if (!"INVESTIGATOR".equalsIgnoreCase(invUser.getRole())) {
            throw new BadRequestException("Target user does not have the INVESTIGATOR role");
        }
        if (!"ACTIVE".equalsIgnoreCase(invUser.getAccountStatus())) {
            throw new BadRequestException("Cannot assign case to an inactive or suspended investigator");
        }
        return investigator;
    }

    private void recordHistory(
            ScamReport report,
            InvestigatorProfile previous,
            InvestigatorProfile next,
            User admin,
            String actionType,
            String notes) {
        AssignmentHistory history = new AssignmentHistory();
        history.setReport(report);
        history.setPreviousInvestigator(previous);
        history.setNewInvestigator(next);
        history.setAdminUser(admin);
        history.setActionType(actionType);
        history.setNotes(notes != null ? notes.trim() : null);
        assignmentHistoryRepository.save(history);
    }

    private void recordActivity(ScamReport report, User admin, String activityType, String description) {
        CaseActivityLog log = new CaseActivityLog();
        log.setReport(report);
        log.setActorUser(admin);
        log.setActorRole("ADMIN");
        log.setActivityType(activityType);
        log.setDescription(description);
        caseActivityLogRepository.save(log);
    }

    private Map<Long, CaseAssignment> loadAssignmentsByReportId(List<ScamReport> reports) {
        if (reports.isEmpty()) {
            return Map.of();
        }
        List<Long> reportIds = reports.stream().map(ScamReport::getId).toList();
        return caseAssignmentRepository.findByReportIdIn(reportIds).stream()
                .collect(Collectors.toMap(ca -> ca.getReport().getId(), Function.identity()));
    }

    private AdminReportSummaryResponse toReportSummary(ScamReport report, CaseAssignment assignment) {
        AdminReportSummaryResponse response = new AdminReportSummaryResponse();
        response.setId(report.getId());
        response.setCaseReference(report.getCaseReference());
        response.setScamCategory(report.getScamCategory());
        response.setDescription(report.getDescription());
        response.setFinancialLoss(report.getFinancialLoss());
        response.setTransactionId(report.getTransactionId());
        response.setPlatform(report.getPlatform());
        response.setIncidentDate(report.getIncidentDate());
        response.setSubmittedAt(report.getSubmittedAt());
        response.setPriority(report.getPriority());
        response.setStatus(report.getStatus());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setCurrentAssignment(assignment != null ? toAssignmentResponse(assignment) : null);
        return response;
    }

    private CaseAssignmentResponse toAssignmentResponse(CaseAssignment assignment) {
        CaseAssignmentResponse response = new CaseAssignmentResponse();
        response.setId(assignment.getId());
        response.setReportId(assignment.getReport().getId());
        response.setCaseReference(assignment.getReport().getCaseReference());
        response.setInvestigatorId(assignment.getInvestigator().getId());
        response.setInvestigatorName(assignment.getInvestigator().getDisplayName());
        response.setCyberId(assignment.getInvestigator().getCyberId());
        response.setAssignedByAdminId(assignment.getAssignedByAdmin().getId());
        response.setAssignedAt(assignment.getAssignedAt());
        response.setAssignmentStatus(assignment.getAssignmentStatus());
        return response;
    }

    private AssignmentHistoryResponse toHistoryResponse(AssignmentHistory history) {
        AssignmentHistoryResponse response = new AssignmentHistoryResponse();
        response.setId(history.getId());
        response.setReportId(history.getReport().getId());
        response.setCaseReference(history.getReport().getCaseReference());
        if (history.getPreviousInvestigator() != null) {
            response.setPreviousInvestigatorId(history.getPreviousInvestigator().getId());
            response.setPreviousInvestigatorName(history.getPreviousInvestigator().getDisplayName());
        }
        response.setNewInvestigatorId(history.getNewInvestigator().getId());
        response.setNewInvestigatorName(history.getNewInvestigator().getDisplayName());
        response.setAdminUserId(history.getAdminUser().getId());
        response.setActionType(history.getActionType());
        response.setNotes(history.getNotes());
        response.setAssignedAt(history.getAssignedAt());
        return response;
    }
}
