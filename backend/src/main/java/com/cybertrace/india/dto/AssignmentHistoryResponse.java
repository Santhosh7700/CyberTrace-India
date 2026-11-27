package com.cybertrace.india.dto;

import java.time.OffsetDateTime;

public class AssignmentHistoryResponse {

    private Long id;
    private Long reportId;
    private String caseReference;
    private Long previousInvestigatorId;
    private String previousInvestigatorName;
    private Long newInvestigatorId;
    private String newInvestigatorName;
    private Long adminUserId;
    private String actionType;
    private String notes;
    private OffsetDateTime assignedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public Long getPreviousInvestigatorId() { return previousInvestigatorId; }
    public void setPreviousInvestigatorId(Long previousInvestigatorId) { this.previousInvestigatorId = previousInvestigatorId; }
    public String getPreviousInvestigatorName() { return previousInvestigatorName; }
    public void setPreviousInvestigatorName(String previousInvestigatorName) { this.previousInvestigatorName = previousInvestigatorName; }
    public Long getNewInvestigatorId() { return newInvestigatorId; }
    public void setNewInvestigatorId(Long newInvestigatorId) { this.newInvestigatorId = newInvestigatorId; }
    public String getNewInvestigatorName() { return newInvestigatorName; }
    public void setNewInvestigatorName(String newInvestigatorName) { this.newInvestigatorName = newInvestigatorName; }
    public Long getAdminUserId() { return adminUserId; }
    public void setAdminUserId(Long adminUserId) { this.adminUserId = adminUserId; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public OffsetDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(OffsetDateTime assignedAt) { this.assignedAt = assignedAt; }
}
