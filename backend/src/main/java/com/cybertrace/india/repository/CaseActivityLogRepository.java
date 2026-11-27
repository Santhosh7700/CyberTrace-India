package com.cybertrace.india.repository;

import com.cybertrace.india.entity.CaseActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseActivityLogRepository extends JpaRepository<CaseActivityLog, Long> {
    List<CaseActivityLog> findByReportIdOrderByCreatedAtDesc(Long reportId);
}
