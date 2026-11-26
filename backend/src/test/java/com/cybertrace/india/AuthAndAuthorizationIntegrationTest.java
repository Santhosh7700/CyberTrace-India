package com.cybertrace.india;

import com.cybertrace.india.entity.User;
import com.cybertrace.india.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "app.jwt.secret=dGVzdC1qd3Qtc2VjcmV0LWtleS1mb3ItY3liZXJ0cmFjZS1pbmRpYS10ZXN0cy0yNTZiaXQ=",
        "app.jwt.expiration-ms=3600000"
})
class AuthAndAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private String registerCitizenAndGetToken(String email, String password) throws Exception {
        Map<String, String> payload = Map.of(
                "fullName", "Test Citizen",
                "email", email,
                "mobile", "9876543210",
                "password", password
        );

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }

    private String createUserWithRoleAndLogin(String email, String rawPassword, String role) throws Exception {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setAccountStatus("ACTIVE");
        userRepository.save(user);

        Map<String, String> loginPayload = Map.of(
                "email", email,
                "password", rawPassword
        );

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginPayload)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }

    @Test
    void citizenRegistrationSucceedsAndStoresBcryptHash() throws Exception {
        Map<String, String> payload = Map.of(
                "fullName", "Aarav Sharma",
                "email", "aarav.sharma@example.com",
                "mobile", "9876543210",
                "password", "StrongPass@123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("aarav.sharma@example.com"))
                .andExpect(jsonPath("$.user.role").value("CITIZEN"))
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist());

        User saved = userRepository.findByEmailIgnoreCase("aarav.sharma@example.com").orElseThrow();
        assertThat(saved.getPasswordHash()).startsWith("$2");
        assertThat(passwordEncoder.matches("StrongPass@123", saved.getPasswordHash())).isTrue();
    }

    @Test
    void duplicateEmailRegistrationIsRejected() throws Exception {
        registerCitizenAndGetToken("dup.user@example.com", "StrongPass@123");

        Map<String, String> duplicatePayload = Map.of(
                "fullName", "Duplicate User",
                "email", "dup.user@example.com",
                "mobile", "9876543211",
                "password", "StrongPass@123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicatePayload)))
                .andExpect(status().isConflict());
    }

    @Test
    void loginSucceedsWithValidCredentialsAndFailsWithInvalidPassword() throws Exception {
        registerCitizenAndGetToken("login.user@example.com", "ValidPass@123");

        Map<String, String> validLogin = Map.of(
                "email", "login.user@example.com",
                "password", "ValidPass@123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.user.role").value("CITIZEN"));

        Map<String, String> invalidLogin = Map.of(
                "email", "login.user@example.com",
                "password", "WrongPass@999"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLogin)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validJwtAuthenticatesMeEndpointAndInvalidOrExpiredJwtIsRejected() throws Exception {
        String token = registerCitizenAndGetToken("jwt.user@example.com", "ValidPass@123");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jwt.user@example.com"))
                .andExpect(jsonPath("$.role").value("CITIZEN"));

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid.malformed.token"))
                .andExpect(status().isUnauthorized());

        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        String expiredToken = Jwts.builder()
                .subject("jwt.user@example.com")
                .issuedAt(new Date(System.currentTimeMillis() - 120_000))
                .expiration(new Date(System.currentTimeMillis() - 60_000))
                .signWith(key)
                .compact();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void roleBasedAccessControlIsEnforcedAcrossAllThreeRoles() throws Exception {
        String citizenToken = registerCitizenAndGetToken("rbac.citizen@example.com", "ValidPass@123");
        String investigatorToken = createUserWithRoleAndLogin("rbac.inv@example.com", "ValidPass@123", "INVESTIGATOR");
        String adminToken = createUserWithRoleAndLogin("rbac.admin@example.com", "ValidPass@123", "ADMIN");

        // Citizen
        mockMvc.perform(get("/api/citizen/test").header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/investigator/test").header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/test").header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());

        // Investigator
        mockMvc.perform(get("/api/investigator/test").header("Authorization", "Bearer " + investigatorToken))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/admin/test").header("Authorization", "Bearer " + investigatorToken))
                .andExpect(status().isForbidden());

        // Admin
        mockMvc.perform(get("/api/admin/test").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedRequestsAreDeniedAndHealthEndpointRemainsPublic() throws Exception {
        mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/citizen/test")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/investigator/test")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/admin/test")).andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"));
    }
}
