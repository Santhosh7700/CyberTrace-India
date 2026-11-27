package com.cybertrace.india.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class AdminReportSummaryResponse {

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
    private CaseAssignmentResponse currentAssignment;

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
    public CaseAssignmentResponse getCurrentAssignment() { return currentAssignment; }
    public void setCurrentAssignment(CaseAssignmentResponse currentAssignment) { this.currentAssignment = currentAssignment; }
}
