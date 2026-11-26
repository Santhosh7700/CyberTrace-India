package com.cybertrace.india.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "scam_reports")
public class ScamReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_reference", nullable = false, unique = true, length = 32)
    private String caseReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private CitizenProfile citizen;

    @Column(name = "scam_category", nullable = false, length = 64)
    private String scamCategory;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "financial_loss", precision = 15, scale = 2)
    private BigDecimal financialLoss = BigDecimal.ZERO;

    @Column(name = "transaction_id", length = 128)
    private String transactionId;

    @Column(nullable = false, length = 150)
    private String platform;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    @Column(nullable = false, length = 24)
    private String priority = "MEDIUM";

    @Column(nullable = false, length = 32)
    private String status = "SUBMITTED";

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public CitizenProfile getCitizen() { return citizen; }
    public void setCitizen(CitizenProfile citizen) { this.citizen = citizen; }
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
}
