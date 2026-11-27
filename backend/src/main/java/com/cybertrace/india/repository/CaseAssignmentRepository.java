package com.cybertrace.india.repository;

import com.cybertrace.india.entity.CaseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CaseAssignmentRepository extends JpaRepository<CaseAssignment, Long> {
    Optional<CaseAssignment> findByReportId(Long reportId);
    List<CaseAssignment> findByReportIdIn(List<Long> reportIds);
}
