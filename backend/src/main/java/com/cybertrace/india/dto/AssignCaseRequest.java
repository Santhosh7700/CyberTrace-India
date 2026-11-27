package com.cybertrace.india.dto;

import jakarta.validation.constraints.NotNull;

public class AssignCaseRequest {

    @NotNull(message = "Investigator ID is required")
    private Long investigatorId;

    private String notes;

    public Long getInvestigatorId() { return investigatorId; }
    public void setInvestigatorId(Long investigatorId) { this.investigatorId = investigatorId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
