package com.cybertrace.india.dto;

import java.time.OffsetDateTime;

public class CaseAssignmentResponse {

    private Long id;
    private Long reportId;
    private String caseReference;
    private Long investigatorId;
    private String investigatorName;
    private String cyberId;
    private Long assignedByAdminId;
    private OffsetDateTime assignedAt;
    private String assignmentStatus;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public String getCaseReference() { return caseReference; }
    public void setCaseReference(String caseReference) { this.caseReference = caseReference; }
    public Long getInvestigatorId() { return investigatorId; }
    public void setInvestigatorId(Long investigatorId) { this.investigatorId = investigatorId; }
    public String getInvestigatorName() { return investigatorName; }
    public void setInvestigatorName(String investigatorName) { this.investigatorName = investigatorName; }
    public String getCyberId() { return cyberId; }
    public void setCyberId(String cyberId) { this.cyberId = cyberId; }
    public Long getAssignedByAdminId() { return assignedByAdminId; }
    public void setAssignedByAdminId(Long assignedByAdminId) { this.assignedByAdminId = assignedByAdminId; }
    public OffsetDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(OffsetDateTime assignedAt) { this.assignedAt = assignedAt; }
    public String getAssignmentStatus() { return assignmentStatus; }
    public void setAssignmentStatus(String assignmentStatus) { this.assignmentStatus = assignmentStatus; }
}
