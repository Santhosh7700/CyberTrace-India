package com.cybertrace.india.service;

import com.cybertrace.india.dto.EvidenceMetadataResponse;
import com.cybertrace.india.entity.CitizenProfile;
import com.cybertrace.india.entity.EvidenceFile;
import com.cybertrace.india.entity.ScamReport;
import com.cybertrace.india.exception.BadRequestException;
import com.cybertrace.india.exception.ResourceNotFoundException;
import com.cybertrace.india.repository.EvidenceFileRepository;
import com.cybertrace.india.repository.ScamReportRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class CitizenEvidenceService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB
    private static final int TEXT_SAMPLE_BYTES = 8192;

    private static final Map<String, Set<String>> ALLOWED_MIME_EXTENSIONS = Map.of(
            "image/jpeg", Set.of(".jpg", ".jpeg"),
            "image/png", Set.of(".png"),
            "image/webp", Set.of(".webp"),
            "application/pdf", Set.of(".pdf"),
            "text/plain", Set.of(".txt"),
            "video/mp4", Set.of(".mp4")
    );

    private final CitizenReportService citizenReportService;
    private final ScamReportRepository scamReportRepository;
    private final EvidenceFileRepository evidenceFileRepository;
    private final StorageService storageService;

    public CitizenEvidenceService(
            CitizenReportService citizenReportService,
            ScamReportRepository scamReportRepository,
            EvidenceFileRepository evidenceFileRepository,
            StorageService storageService) {
        this.citizenReportService = citizenReportService;
        this.scamReportRepository = scamReportRepository;
        this.evidenceFileRepository = evidenceFileRepository;
        this.storageService = storageService;
    }

    @Transactional
    public EvidenceMetadataResponse uploadEvidence(String citizenEmail, Long reportId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Evidence file is required and cannot be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Evidence file size must not exceed 10 MB");
        }

        String rawContentType = file.getContentType();
        if (rawContentType == null) {
            throw new BadRequestException("Unsupported file type. Allowed: JPEG, PNG, WEBP, PDF, TXT, MP4");
        }
        String contentType = rawContentType.trim().toLowerCase();
        if (!ALLOWED_MIME_EXTENSIONS.containsKey(contentType)) {
            throw new BadRequestException("Unsupported file type. Allowed: JPEG, PNG, WEBP, PDF, TXT, MP4");
        }

        String originalFilename = sanitizeOriginalFilename(file.getOriginalFilename());
        validateExtensionMatchesMime(originalFilename, contentType);
        validateFileContentSignature(file, contentType);

        ScamReport report = verifyReportOwnership(citizenEmail, reportId);

        String storagePath;
        try (InputStream inputStream = file.getInputStream()) {
            storagePath = storageService.store(
                    report.getCaseReference(),
                    originalFilename,
                    inputStream,
                    contentType,
                    file.getSize()
            );
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read uploaded evidence file", ex);
        }

        try {
            EvidenceFile evidence = new EvidenceFile();
            evidence.setReport(report);
            evidence.setOriginalFilename(originalFilename);
            evidence.setFileType(contentType);
            evidence.setFileSize(file.getSize());
            evidence.setStoragePath(storagePath);

            EvidenceFile saved = evidenceFileRepository.save(evidence);
            return toMetadataResponse(saved, report);
        } catch (RuntimeException ex) {
            storageService.delete(storagePath);
            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public List<EvidenceMetadataResponse> listEvidenceForReport(String citizenEmail, Long reportId) {
        ScamReport report = verifyReportOwnership(citizenEmail, reportId);
        return evidenceFileRepository.findByReportIdOrderByUploadedAtDesc(report.getId()).stream()
                .map(ev -> toMetadataResponse(ev, report))
                .toList();
    }

    @Transactional(readOnly = true)
    public EvidenceMetadataResponse getEvidenceMetadata(String citizenEmail, Long evidenceId) {
        EvidenceFile evidence = getOwnedEvidence(citizenEmail, evidenceId);
        return toMetadataResponse(evidence, evidence.getReport());
    }

    @Transactional(readOnly = true)
    public EvidenceDownload loadEvidenceForDownload(String citizenEmail, Long evidenceId) {
        EvidenceFile evidence = getOwnedEvidence(citizenEmail, evidenceId);
        Resource resource = storageService.loadAsResource(evidence.getStoragePath());
        return new EvidenceDownload(resource, evidence.getOriginalFilename(), evidence.getFileType());
    }

    private void validateExtensionMatchesMime(String filename, String contentType) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == filename.length() - 1) {
            return;
        }
        String ext = filename.substring(lastDot).toLowerCase();
        Set<String> allowedExts = ALLOWED_MIME_EXTENSIONS.get(contentType);
        if (allowedExts == null || !allowedExts.contains(ext)) {
            throw new BadRequestException("File extension does not match declared content type");
        }
    }

    private void validateFileContentSignature(MultipartFile file, String contentType) {
        byte[] header;
        try (InputStream is = file.getInputStream()) {
            header = is.readNBytes("text/plain".equals(contentType) ? TEXT_SAMPLE_BYTES : 32);
        } catch (IOException ex) {
            throw new BadRequestException("Unable to read uploaded file content");
        }

        boolean valid = switch (contentType) {
            case "image/jpeg" -> isJpeg(header);
            case "image/png" -> isPng(header);
            case "image/webp" -> isWebp(header);
            case "application/pdf" -> isPdf(header);
            case "video/mp4" -> isMp4(header);
            case "text/plain" -> isPlainText(header);
            default -> false;
        };

        if (!valid) {
            throw new BadRequestException("Uploaded file content does not match the declared file type");
        }
    }

    private boolean isJpeg(byte[] b) {
        return b.length >= 3
                && (b[0] & 0xFF) == 0xFF
                && (b[1] & 0xFF) == 0xD8
                && (b[2] & 0xFF) == 0xFF;
    }

    private boolean isPng(byte[] b) {
        return b.length >= 8
                && (b[0] & 0xFF) == 0x89
                && b[1] == 0x50
                && b[2] == 0x4E
                && b[3] == 0x47
                && b[4] == 0x0D
                && b[5] == 0x0A
                && b[6] == 0x1A
                && b[7] == 0x0A;
    }

    private boolean isWebp(byte[] b) {
        return b.length >= 12
                && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
    }

    private boolean isPdf(byte[] b) {
        return b.length >= 5
                && b[0] == '%' && b[1] == 'P' && b[2] == 'D' && b[3] == 'F' && b[4] == '-';
    }

    private boolean isMp4(byte[] b) {
        return b.length >= 8
                && b[4] == 'f' && b[5] == 't' && b[6] == 'y' && b[7] == 'p';
    }

    private boolean isPlainText(byte[] b) {
        if (b.length == 0) {
            return false;
        }
        for (byte value : b) {
            int unsigned = value & 0xFF;
            if (unsigned == 0x00) {
                return false;
            }
            if (unsigned < 0x20 && unsigned != '\t' && unsigned != '\n' && unsigned != '\r') {
                return false;
            }
        }
        return true;
    }

    private ScamReport verifyReportOwnership(String citizenEmail, Long reportId) {
        CitizenProfile citizen = citizenReportService.resolveCitizenProfile(citizenEmail);
        return scamReportRepository.findByIdAndCitizenId(reportId, citizen.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Scam report not found"));
    }

    private EvidenceFile getOwnedEvidence(String citizenEmail, Long evidenceId) {
        CitizenProfile citizen = citizenReportService.resolveCitizenProfile(citizenEmail);
        EvidenceFile evidence = evidenceFileRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence file not found"));
        if (!evidence.getReport().getCitizen().getId().equals(citizen.getId())) {
            throw new ResourceNotFoundException("Evidence file not found");
        }
        return evidence;
    }

    private String sanitizeOriginalFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "evidence_file";
        }
        String baseName = filename.replace("\\", "/");
        int lastSlash = baseName.lastIndexOf('/');
        if (lastSlash >= 0) {
            baseName = baseName.substring(lastSlash + 1);
        }
        return baseName.isBlank() ? "evidence_file" : baseName;
    }

    private EvidenceMetadataResponse toMetadataResponse(EvidenceFile evidence, ScamReport report) {
        return new EvidenceMetadataResponse(
                evidence.getId(),
                report.getId(),
                report.getCaseReference(),
                evidence.getOriginalFilename(),
                evidence.getFileType(),
                evidence.getFileSize(),
                evidence.getUploadedAt()
        );
    }

    public record EvidenceDownload(Resource resource, String originalFilename, String contentType) {}
}
