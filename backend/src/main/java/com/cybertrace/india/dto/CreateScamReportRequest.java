package com.cybertrace.india.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateScamReportRequest {

    @NotBlank(message = "Scam category is required")
    @Size(max = 64, message = "Scam category must not exceed 64 characters")
    private String scamCategory;

    @NotBlank(message = "Description is required")
    private String description;

    @DecimalMin(value = "0.00", message = "Financial loss cannot be negative")
    private BigDecimal financialLoss = BigDecimal.ZERO;

    @Size(max = 128, message = "Transaction ID must not exceed 128 characters")
    private String transactionId;

    @NotBlank(message = "Platform is required")
    @Size(max = 150, message = "Platform must not exceed 150 characters")
    private String platform;

    @NotNull(message = "Incident date is required")
    @PastOrPresent(message = "Incident date cannot be in the future")
    private LocalDate incidentDate;

    @Size(max = 24, message = "Priority must not exceed 24 characters")
    private String priority;

    @Valid
    private List<IdentifierRequest> identifiers;

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
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public List<IdentifierRequest> getIdentifiers() { return identifiers; }
    public void setIdentifiers(List<IdentifierRequest> identifiers) { this.identifiers = identifiers; }
}
