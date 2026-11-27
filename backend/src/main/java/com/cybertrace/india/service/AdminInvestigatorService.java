package com.cybertrace.india.service;

import com.cybertrace.india.dto.CreateInvestigatorRequest;
import com.cybertrace.india.dto.InvestigatorResponse;
import com.cybertrace.india.dto.UpdateInvestigatorRequest;
import com.cybertrace.india.dto.UpdateInvestigatorStatusRequest;
import com.cybertrace.india.entity.InvestigatorProfile;
import com.cybertrace.india.entity.User;
import com.cybertrace.india.exception.BadRequestException;
import com.cybertrace.india.exception.DuplicateEmailException;
import com.cybertrace.india.exception.ResourceNotFoundException;
import com.cybertrace.india.repository.InvestigatorProfileRepository;
import com.cybertrace.india.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Service
public class AdminInvestigatorService {

    private static final String ROLE_INVESTIGATOR = "INVESTIGATOR";
    private static final Set<String> ALLOWED_ACCOUNT_STATUSES = Set.of("ACTIVE", "INACTIVE", "SUSPENDED");
    private static final Set<String> ALLOWED_AVAILABILITY_STATUSES = Set.of(
            "AVAILABLE", "ACTIVE_DUTY", "HIGH_WORKLOAD", "ON_LEAVE"
    );

    private final UserRepository userRepository;
    private final InvestigatorProfileRepository investigatorProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInvestigatorService(
            UserRepository userRepository,
            InvestigatorProfileRepository investigatorProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.investigatorProfileRepository = investigatorProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public InvestigatorResponse createInvestigator(CreateInvestigatorRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        String cyberId = request.getCyberId().trim();
        if (investigatorProfileRepository.findByCyberId(cyberId).isPresent()) {
            throw new BadRequestException("Cyber ID is already in use");
        }

        String badgeNumber = request.getBadgeNumber().trim();
        if (investigatorProfileRepository.findByBadgeNumber(badgeNumber).isPresent()) {
            throw new BadRequestException("Badge number is already in use");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(ROLE_INVESTIGATOR);
        user.setAccountStatus("ACTIVE");
        User savedUser = userRepository.save(user);

        InvestigatorProfile profile = new InvestigatorProfile();
        profile.setUser(savedUser);
        profile.setCyberId(cyberId);
        profile.setBadgeNumber(badgeNumber);
        profile.setDisplayName(request.getDisplayName().trim());
        profile.setRankTitle(request.getRankTitle() != null ? request.getRankTitle().trim() : null);
        profile.setDepartment(request.getDepartment().trim());
        profile.setAvailabilityStatus("AVAILABLE");

        InvestigatorProfile savedProfile = investigatorProfileRepository.save(profile);
        return toResponse(savedProfile);
    }

    @Transactional(readOnly = true)
    public List<InvestigatorResponse> listInvestigators() {
        return investigatorProfileRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvestigatorResponse getInvestigator(Long investigatorId) {
        InvestigatorProfile profile = investigatorProfileRepository.findById(investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investigator not found"));
        return toResponse(profile);
    }

    @Transactional
    public InvestigatorResponse updateInvestigator(Long investigatorId, UpdateInvestigatorRequest request) {
        InvestigatorProfile profile = investigatorProfileRepository.findById(investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investigator not found"));

        profile.setDisplayName(request.getDisplayName().trim());
        profile.setRankTitle(request.getRankTitle() != null ? request.getRankTitle().trim() : null);
        profile.setDepartment(request.getDepartment().trim());

        if (request.getAvailabilityStatus() != null && !request.getAvailabilityStatus().isBlank()) {
            String status = request.getAvailabilityStatus().trim().toUpperCase();
            if (!ALLOWED_AVAILABILITY_STATUSES.contains(status)) {
                throw new BadRequestException("Invalid availability status");
            }
            profile.setAvailabilityStatus(status);
        }

        profile.setUpdatedAt(OffsetDateTime.now());
        return toResponse(investigatorProfileRepository.save(profile));
    }

    @Transactional
    public InvestigatorResponse updateInvestigatorStatus(Long investigatorId, UpdateInvestigatorStatusRequest request) {
        InvestigatorProfile profile = investigatorProfileRepository.findById(investigatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investigator not found"));

        String status = request.getAccountStatus().trim().toUpperCase();
        if (!ALLOWED_ACCOUNT_STATUSES.contains(status)) {
            throw new BadRequestException("Invalid account status. Allowed: ACTIVE, INACTIVE, SUSPENDED");
        }

        User user = profile.getUser();
        user.setAccountStatus(status);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);

        return toResponse(profile);
    }

    private InvestigatorResponse toResponse(InvestigatorProfile profile) {
        User user = profile.getUser();
        InvestigatorResponse response = new InvestigatorResponse();
        response.setId(profile.getId());
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setAccountStatus(user.getAccountStatus());
        response.setCyberId(profile.getCyberId());
        response.setBadgeNumber(profile.getBadgeNumber());
        response.setDisplayName(profile.getDisplayName());
        response.setRankTitle(profile.getRankTitle());
        response.setDepartment(profile.getDepartment());
        response.setAvailabilityStatus(profile.getAvailabilityStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
