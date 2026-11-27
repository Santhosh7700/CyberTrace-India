package com.cybertrace.india.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public class ScamReportResponse {

    private Long id;
    private String caseReference;
    private String scamCategory;
    private String description;
    private BigDecimal financialLoss;
    private String transactionId;
    private String platform;
    private LocalDate incidentDate;
    private OffsetDateTime submittedAt;
    private String priority;
    private String status;
    private OffsetDateTime updatedAt;
    private List<IdentifierResponse> identifiers;
    private List<EvidenceMetadataResponse> evidenceFiles;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public String getScamCategory() { return scamCategory; }
    public void setScamCategory(String scamCategory) { this.scamCategory = scamCategory; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getFinancialLoss() { return financialLoss; }
    public void setFinancialLoss(BigDecimal financialLoss) { this.financialLoss = financialLoss; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<IdentifierResponse> getIdentifiers() { return identifiers; }
    public void setIdentifiers(List<IdentifierResponse> identifiers) { this.identifiers = identifiers; }
    public List<EvidenceMetadataResponse> getEvidenceFiles() { return evidenceFiles; }
    public void setEvidenceFiles(List<EvidenceMetadataResponse> evidenceFiles) { this.evidenceFiles = evidenceFiles; }
}
