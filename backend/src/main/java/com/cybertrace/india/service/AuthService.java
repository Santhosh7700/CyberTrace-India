package com.cybertrace.india.service;

import com.cybertrace.india.dto.AuthResponse;
import com.cybertrace.india.dto.LoginRequest;
import com.cybertrace.india.dto.RegisterRequest;
import com.cybertrace.india.dto.UserSummaryResponse;
import com.cybertrace.india.entity.CitizenProfile;
import com.cybertrace.india.entity.InvestigatorProfile;
import com.cybertrace.india.entity.User;
import com.cybertrace.india.exception.DuplicateEmailException;
import com.cybertrace.india.repository.CitizenProfileRepository;
import com.cybertrace.india.repository.InvestigatorProfileRepository;
import com.cybertrace.india.repository.UserRepository;
import com.cybertrace.india.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String ROLE_CITIZEN = "CITIZEN";
    private static final String ROLE_INVESTIGATOR = "INVESTIGATOR";
    private static final String STATUS_ACTIVE = "ACTIVE";

    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final InvestigatorProfileRepository investigatorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final long jwtExpirationMs;

    public AuthService(
            UserRepository userRepository,
            CitizenProfileRepository citizenProfileRepository,
            InvestigatorProfileRepository investigatorProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs) {
        this.userRepository = userRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.investigatorProfileRepository = investigatorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    @Transactional
    public AuthResponse registerCitizen(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(ROLE_CITIZEN);
        user.setAccountStatus(STATUS_ACTIVE);
        User savedUser = userRepository.save(user);

        CitizenProfile profile = new CitizenProfile();
        profile.setUser(savedUser);
        profile.setFullName(request.getFullName().trim());
        profile.setMobile(request.getMobile().trim());
        citizenProfileRepository.save(profile);

        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        UserSummaryResponse summary = new UserSummaryResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getAccountStatus(),
                profile.getFullName()
        );

        return new AuthResponse(token, jwtExpirationMs, summary);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        UserSummaryResponse summary = buildUserSummary(user);

        return new AuthResponse(token, jwtExpirationMs, summary);
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return buildUserSummary(user);
    }

    private UserSummaryResponse buildUserSummary(User user) {
        String fullName = null;
        if (ROLE_CITIZEN.equals(user.getRole())) {
            fullName = citizenProfileRepository.findByUserId(user.getId())
                    .map(CitizenProfile::getFullName)
                    .orElse(null);
        } else if (ROLE_INVESTIGATOR.equals(user.getRole())) {
            fullName = investigatorProfileRepository.findByUserId(user.getId())
                    .map(InvestigatorProfile::getDisplayName)
                    .orElse(null);
        }
        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus(),
                fullName
        );
    }
}
