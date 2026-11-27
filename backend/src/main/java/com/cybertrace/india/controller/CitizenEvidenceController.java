package com.cybertrace.india.controller;

import com.cybertrace.india.dto.EvidenceMetadataResponse;
import com.cybertrace.india.service.CitizenEvidenceService;
import com.cybertrace.india.service.CitizenEvidenceService.EvidenceDownload;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
public class CitizenEvidenceController {

    private final CitizenEvidenceService citizenEvidenceService;

    public CitizenEvidenceController(CitizenEvidenceService citizenEvidenceService) {
        this.citizenEvidenceService = citizenEvidenceService;
    }

    @PostMapping(value = "/reports/{reportId}/evidence", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EvidenceMetadataResponse> uploadEvidence(
            Authentication authentication,
            @PathVariable Long reportId,
            @RequestParam("file") MultipartFile file) {
        EvidenceMetadataResponse response = citizenEvidenceService.uploadEvidence(
                authentication.getName(), reportId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/reports/{reportId}/evidence")
    public ResponseEntity<List<EvidenceMetadataResponse>> listEvidence(
            Authentication authentication,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(citizenEvidenceService.listEvidenceForReport(authentication.getName(), reportId));
    }

    @GetMapping("/evidence/{evidenceId}")
    public ResponseEntity<EvidenceMetadataResponse> getEvidenceMetadata(
            Authentication authentication,
            @PathVariable Long evidenceId) {
        return ResponseEntity.ok(citizenEvidenceService.getEvidenceMetadata(authentication.getName(), evidenceId));
    }

    @GetMapping("/evidence/{evidenceId}/download")
    public ResponseEntity<Resource> downloadOrPreviewEvidence(
            Authentication authentication,
            @PathVariable Long evidenceId,
            @RequestParam(name = "disposition", defaultValue = "inline") String disposition) {
        EvidenceDownload download = citizenEvidenceService.loadEvidenceForDownload(authentication.getName(), evidenceId);
        String dispType = "attachment".equalsIgnoreCase(disposition) ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, dispType + "; filename=\"" + download.originalFilename() + "\"")
                .body(download.resource());
    }
}
