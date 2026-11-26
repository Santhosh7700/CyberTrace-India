package com.cybertrace.india.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "assignment_history")
public class AssignmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private ScamReport report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_investigator_id")
    private InvestigatorProfile previousInvestigator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_investigator_id", nullable = false)
    private InvestigatorProfile newInvestigator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private User adminUser;

    @Column(name = "action_type", nullable = false, length = 32)
    private String actionType; // INITIAL_ASSIGNMENT, REASSIGNMENT

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private OffsetDateTime assignedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ScamReport getReport() { return report; }
    public void setReport(ScamReport report) { this.report = report; }
    public InvestigatorProfile getPreviousInvestigator() { return previousInvestigator; }
    public void setPreviousInvestigator(InvestigatorProfile previousInvestigator) { this.previousInvestigator = previousInvestigator; }
    public InvestigatorProfile getNewInvestigator() { return newInvestigator; }
    public void setNewInvestigator(InvestigatorProfile newInvestigator) { this.newInvestigator = newInvestigator; }
    public User getAdminUser() { return adminUser; }
    public void setAdminUser(User adminUser) { this.adminUser = adminUser; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public OffsetDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(OffsetDateTime assignedAt) { this.assignedAt = assignedAt; }
}
