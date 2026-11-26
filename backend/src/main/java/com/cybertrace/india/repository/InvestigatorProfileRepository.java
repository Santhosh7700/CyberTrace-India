package com.cybertrace.india.repository;

import com.cybertrace.india.entity.InvestigatorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvestigatorProfileRepository extends JpaRepository<InvestigatorProfile, Long> {
    Optional<InvestigatorProfile> findByCyberId(String cyberId);
}
