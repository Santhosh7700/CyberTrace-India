package com.cybertrace.india.dto;

import java.time.OffsetDateTime;

public class EvidenceMetadataResponse {

    private Long id;
    private Long reportId;
    private String caseReference;
    private String originalFilename;
    private String fileType;
    private Long fileSize;
    private OffsetDateTime uploadedAt;

    public EvidenceMetadataResponse() {}

    public EvidenceMetadataResponse(
            Long id,
            Long reportId,
            String caseReference,
            String originalFilename,
            String fileType,
            Long fileSize,
            OffsetDateTime uploadedAt) {
        this.id = id;
        this.reportId = reportId;
        this.caseReference = caseReference;
        this.originalFilename = originalFilename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public OffsetDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(OffsetDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
