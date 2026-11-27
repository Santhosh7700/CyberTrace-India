package com.cybertrace.india.repository;

import com.cybertrace.india.entity.ScamReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ScamReportRepository extends JpaRepository<ScamReport, Long> {
    Optional<ScamReport> findByCaseReference(String caseReference);
    List<ScamReport> findByCitizenIdOrderBySubmittedAtDesc(Long citizenId);
    Optional<ScamReport> findByIdAndCitizenId(Long id, Long citizenId);
    Optional<ScamReport> findByCaseReferenceAndCitizenId(String caseReference, Long citizenId);
    List<ScamReport> findAllByOrderBySubmittedAtDesc();

    @Query("SELECT r FROM ScamReport r WHERE r.id NOT IN (SELECT ca.report.id FROM CaseAssignment ca) ORDER BY r.submittedAt DESC")
    List<ScamReport> findUnassignedReportsOrderBySubmittedAtDesc();

    @Query("SELECT r FROM ScamReport r WHERE r.id IN (SELECT ca.report.id FROM CaseAssignment ca) ORDER BY r.submittedAt DESC")
    List<ScamReport> findAssignedReportsOrderBySubmittedAtDesc();
}
