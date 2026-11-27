package com.cybertrace.india.repository;

import com.cybertrace.india.entity.ReportIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportIdentifierRepository extends JpaRepository<ReportIdentifier, Long> {
    List<ReportIdentifier> findByReportIdOrderByIdAsc(Long reportId);
}
