package com.cybertrace.india.repository;

import com.cybertrace.india.entity.EvidenceFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvidenceFileRepository extends JpaRepository<EvidenceFile, Long> {
    List<EvidenceFile> findByReportIdOrderByUploadedAtDesc(Long reportId);
    Optional<EvidenceFile> findByIdAndReportId(Long id, Long reportId);
}
