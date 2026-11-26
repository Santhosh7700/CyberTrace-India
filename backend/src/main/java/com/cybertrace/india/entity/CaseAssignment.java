package com.cybertrace.india.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "case_assignments")
public class CaseAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false, unique = true)
    private ScamReport report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigator_id", nullable = false)
    private InvestigatorProfile investigator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_admin_id", nullable = false)
    private User assignedByAdmin;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private OffsetDateTime assignedAt = OffsetDateTime.now();

    @Column(name = "assignment_status", nullable = false, length = 32)
    private String assignmentStatus = "ACTIVE";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ScamReport getReport() { return report; }
    public void setReport(ScamReport report) { this.report = report; }
    public InvestigatorProfile getInvestigator() { return investigator; }
    public void setInvestigator(InvestigatorProfile investigator) { this.investigator = investigator; }
    public User getAssignedByAdmin() { return assignedByAdmin; }
    public void setAssignedByAdmin(User assignedByAdmin) { this.assignedByAdmin = assignedByAdmin; }
    public OffsetDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(OffsetDateTime assignedAt) { this.assignedAt = assignedAt; }
    public String getAssignmentStatus() { return assignmentStatus; }
    public void setAssignmentStatus(String assignmentStatus) { this.assignmentStatus = assignmentStatus; }
}
