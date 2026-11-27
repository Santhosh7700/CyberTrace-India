package com.cybertrace.india.service;

import com.cybertrace.india.dto.CreateScamReportRequest;
import com.cybertrace.india.dto.EvidenceMetadataResponse;
import com.cybertrace.india.dto.IdentifierRequest;
import com.cybertrace.india.dto.IdentifierResponse;
import com.cybertrace.india.dto.ScamReportResponse;
import com.cybertrace.india.entity.CitizenProfile;
import com.cybertrace.india.entity.EvidenceFile;
import com.cybertrace.india.entity.ReportIdentifier;
import com.cybertrace.india.entity.ScamReport;
import com.cybertrace.india.entity.User;
import com.cybertrace.india.exception.BadRequestException;
import com.cybertrace.india.exception.ResourceNotFoundException;
import com.cybertrace.india.repository.CitizenProfileRepository;
import com.cybertrace.india.repository.EvidenceFileRepository;
import com.cybertrace.india.repository.ReportIdentifierRepository;
import com.cybertrace.india.repository.ScamReportRepository;
import com.cybertrace.india.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CitizenReportService {

    private static final Set<String> ALLOWED_IDENTIFIER_TYPES = Set.of("PHONE", "UPI", "EMAIL", "URL");
    private static final Set<String> ALLOWED_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH", "CRITICAL");

    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final ScamReportRepository scamReportRepository;
    private final ReportIdentifierRepository reportIdentifierRepository;
    private final EvidenceFileRepository evidenceFileRepository;

    public CitizenReportService(
            UserRepository userRepository,
            CitizenProfileRepository citizenProfileRepository,
            ScamReportRepository scamReportRepository,
            ReportIdentifierRepository reportIdentifierRepository,
            EvidenceFileRepository evidenceFileRepository) {
        this.userRepository = userRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.scamReportRepository = scamReportRepository;
        this.reportIdentifierRepository = reportIdentifierRepository;
        this.evidenceFileRepository = evidenceFileRepository;
    }

    @Transactional
    public ScamReportResponse createReport(String citizenEmail, CreateScamReportRequest request) {
        CitizenProfile citizen = resolveCitizenProfile(citizenEmail);

        String priority = "MEDIUM";
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            String normalizedPriority = request.getPriority().trim().toUpperCase();
            if (!ALLOWED_PRIORITIES.contains(normalizedPriority)) {
                throw new BadRequestException("Invalid priority. Allowed values: LOW, MEDIUM, HIGH, CRITICAL");
            }
            priority = normalizedPriority;
        }

        ScamReport report = new ScamReport();
        report.setCaseReference(generateUniqueCaseReference());
        report.setCitizen(citizen);
        report.setScamCategory(request.getScamCategory().trim());
        report.setDescription(request.getDescription().trim());
        report.setFinancialLoss(request.getFinancialLoss() != null ? request.getFinancialLoss() : BigDecimal.ZERO);
        report.setTransactionId(request.getTransactionId() != null ? request.getTransactionId().trim() : null);
        report.setPlatform(request.getPlatform().trim());
        report.setIncidentDate(request.getIncidentDate());
        report.setPriority(priority);
        report.setStatus("SUBMITTED");

        ScamReport savedReport = scamReportRepository.save(report);

        List<ReportIdentifier> savedIdentifiers = new ArrayList<>();
        if (request.getIdentifiers() != null) {
            for (IdentifierRequest idReq : request.getIdentifiers()) {
                String type = idReq.getType().trim().toUpperCase();
                if (!ALLOWED_IDENTIFIER_TYPES.contains(type)) {
                    throw new BadRequestException("Invalid identifier type: " + idReq.getType() + ". Allowed: PHONE, UPI, EMAIL, URL");
                }
                String originalValue = idReq.getValue().trim();
                String normalizedValue = normalizeIdentifier(type, originalValue);

                ReportIdentifier identifier = new ReportIdentifier();
                identifier.setReport(savedReport);
                identifier.setIdentifierType(type);
                identifier.setOriginalValue(originalValue);
                identifier.setNormalizedValue(normalizedValue);
                savedIdentifiers.add(reportIdentifierRepository.save(identifier));
            }
        }

        return toResponse(savedReport, savedIdentifiers, List.of());
    }

    @Transactional(readOnly = true)
    public List<ScamReportResponse> getMyReports(String citizenEmail) {
        CitizenProfile citizen = resolveCitizenProfile(citizenEmail);
        List<ScamReport> reports = scamReportRepository.findByCitizenIdOrderBySubmittedAtDesc(citizen.getId());
        return reports.stream()
                .map(report -> toResponse(
                        report,
                        reportIdentifierRepository.findByReportIdOrderByIdAsc(report.getId()),
                        evidenceFileRepository.findByReportIdOrderByUploadedAtDesc(report.getId())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ScamReportResponse getMyReportById(String citizenEmail, Long reportId) {
        CitizenProfile citizen = resolveCitizenProfile(citizenEmail);
        ScamReport report = scamReportRepository.findByIdAndCitizenId(reportId, citizen.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));
        return toResponse(
                report,
                reportIdentifierRepository.findByReportIdOrderByIdAsc(report.getId()),
                evidenceFileRepository.findByReportIdOrderByUploadedAtDesc(report.getId())
        );
    }

    @Transactional(readOnly = true)
    public ScamReportResponse getMyReportByReference(String citizenEmail, String caseReference) {
        CitizenProfile citizen = resolveCitizenProfile(citizenEmail);
        ScamReport report = scamReportRepository.findByCaseReferenceAndCitizenId(caseReference.trim(), citizen.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));
        return toResponse(
                report,
                reportIdentifierRepository.findByReportIdOrderByIdAsc(report.getId()),
                evidenceFileRepository.findByReportIdOrderByUploadedAtDesc(report.getId())
        );
    }

    public CitizenProfile resolveCitizenProfile(String citizenEmail) {
        User user = userRepository.findByEmailIgnoreCase(citizenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen account not found"));
        return citizenProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Citizen profile not found"));
    }

    private String generateUniqueCaseReference() {
        String prefix = "CTI-" + Year.now().getValue() + "-";
        for (int i = 0; i < 5; i++) {
            String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
            String candidate = prefix + suffix;
            if (scamReportRepository.findByCaseReference(candidate).isEmpty()) {
                return candidate;
            }
        }
        return prefix + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    private String normalizeIdentifier(String type, String value) {
        if ("PHONE".equals(type)) {
            String digits = value.replaceAll("[^0-9+]", "");
            return digits.isEmpty() ? value.toLowerCase() : digits;
        }
        return value.toLowerCase();
    }

    private ScamReportResponse toResponse(
            ScamReport report,
            List<ReportIdentifier> identifiers,
            List<EvidenceFile> evidenceFiles) {
        ScamReportResponse response = new ScamReportResponse();
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

        response.setIdentifiers(identifiers.stream()
                .map(id -> new IdentifierResponse(
                        id.getId(),
                        id.getIdentifierType(),
                        id.getOriginalValue(),
                        id.getNormalizedValue(),
                        id.getCreatedAt()
                ))
                .toList());

        response.setEvidenceFiles(evidenceFiles.stream()
                .map(ev -> new EvidenceMetadataResponse(
                        ev.getId(),
                        report.getId(),
                        report.getCaseReference(),
                        ev.getOriginalFilename(),
                        ev.getFileType(),
                        ev.getFileSize(),
                        ev.getUploadedAt()
                ))
                .toList());

        return response;
    }
}
