package com.cybertrace.india.repository;

import com.cybertrace.india.entity.AssignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentHistoryRepository extends JpaRepository<AssignmentHistory, Long> {
    List<AssignmentHistory> findByReportIdOrderByAssignedAtDesc(Long reportId);
}
