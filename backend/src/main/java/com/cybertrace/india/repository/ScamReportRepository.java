package com.cybertrace.india.repository;

import com.cybertrace.india.entity.ScamReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScamReportRepository extends JpaRepository<ScamReport, Long> {
    Optional<ScamReport> findByCaseReference(String caseReference);
}
