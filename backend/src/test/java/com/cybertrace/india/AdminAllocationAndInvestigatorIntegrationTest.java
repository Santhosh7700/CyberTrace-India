package com.cybertrace.india;

import com.cybertrace.india.entity.User;
import com.cybertrace.india.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "app.jwt.secret=dGVzdC1qd3Qtc2VjcmV0LWtleS1mb3ItY3liZXJ0cmFjZS1pbmRpYS10ZXN0cy0yNTZiaXQ=",
        "app.jwt.expiration-ms=3600000"
})
class AdminAllocationAndInvestigatorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String loginWithRole(String email, String role) throws Exception {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("StrongPass@123"));
        user.setRole(role);
        user.setAccountStatus("ACTIVE");
        userRepository.save(user);

        Map<String, String> login = Map.of("email", email, "password", "StrongPass@123");
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    private String registerCitizen(String email) throws Exception {
        Map<String, String> payload = Map.of(
                "fullName", "Citizen Reporter",
                "email", email,
                "mobile", "9876543210",
                "password", "StrongPass@123"
        );
        MvcResult res = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    private long submitReport(String citizenToken) throws Exception {
        Map<String, Object> report = Map.of(
                "scamCategory", "Phishing",
                "description", "Fake bank KYC SMS link.",
                "financialLoss", 5000.00,
                "platform", "SMS",
                "incidentDate", "2026-11-22"
        );
        MvcResult res = mockMvc.perform(post("/api/citizen/reports")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(report)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();
    }

    private JsonNode createInvestigator(String adminToken, String email, String cyberId, String badge) throws Exception {
        Map<String, String> payload = Map.of(
                "email", email,
                "password", "InvPass@123",
                "cyberId", cyberId,
                "badgeNumber", badge,
                "displayName", "Inspector " + cyberId,
                "rankTitle", "Inspector",
                "department", "Cyber Crime Cell"
        );
        MvcResult res = mockMvc.perform(post("/api/admin/investigators")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString());
    }

    @Test
    void adminCanManageInvestigatorsAndPreventDuplicates() throws Exception {
        String adminToken = loginWithRole("admin.inv@example.com", "ADMIN");

        JsonNode inv = createInvestigator(adminToken, "inv1@cybertrace.in", "CYB-101", "BDG-101");
        long invId = inv.get("id").asLong();

        // Duplicate email rejected
        Map<String, String> dupPayload = Map.of(
                "email", "inv1@cybertrace.in",
                "password", "InvPass@123",
                "cyberId", "CYB-102",
                "badgeNumber", "BDG-102",
                "displayName", "Duplicate",
                "department", "Cyber Crime Cell"
        );
        mockMvc.perform(post("/api/admin/investigators")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dupPayload)))
                .andExpect(status().isConflict());

        // List & get investigator
        mockMvc.perform(get("/api/admin/investigators")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cyberId").value("CYB-101"));

        mockMvc.perform(get("/api/admin/investigators/" + invId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("inv1@cybertrace.in"));

        // Deactivate & reactivate
        mockMvc.perform(patch("/api/admin/investigators/" + invId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("accountStatus", "INACTIVE"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountStatus").value("INACTIVE"));

        mockMvc.perform(patch("/api/admin/investigators/" + invId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("accountStatus", "ACTIVE"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountStatus").value("ACTIVE"));
    }

    @Test
    void adminCanViewReportsAssignReassignAndTrackHistory() throws Exception {
        String adminToken = loginWithRole("admin.alloc@example.com", "ADMIN");
        String citizenToken = registerCitizen("citizen.alloc@example.com");
        long reportId = submitReport(citizenToken);

        long inv1Id = createInvestigator(adminToken, "inv.a@cybertrace.in", "CYB-201", "BDG-201").get("id").asLong();
        long inv2Id = createInvestigator(adminToken, "inv.b@cybertrace.in", "CYB-202", "BDG-202").get("id").asLong();

        // View incoming & unassigned
        mockMvc.perform(get("/api/admin/reports")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(get("/api/admin/reports/unassigned")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // Assign
        mockMvc.perform(post("/api/admin/reports/" + reportId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inv1Id, "notes", "Initial"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.investigatorId").value(inv1Id));

        // Reassign
        mockMvc.perform(put("/api/admin/reports/" + reportId + "/reassign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inv2Id, "notes", "Workload balance"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.investigatorId").value(inv2Id));

        // Assignment history has 2 entries with preserved previous/new investigators
        mockMvc.perform(get("/api/admin/reports/" + reportId + "/assignment-history")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].actionType").value("REASSIGNMENT"))
                .andExpect(jsonPath("$[0].previousInvestigatorId").value(inv1Id))
                .andExpect(jsonPath("$[0].newInvestigatorId").value(inv2Id))
                .andExpect(jsonPath("$[1].actionType").value("INITIAL_ASSIGNMENT"))
                .andExpect(jsonPath("$[1].newInvestigatorId").value(inv1Id));

        // Duplicate initial assignment is rejected and does not add history
        mockMvc.perform(post("/api/admin/reports/" + reportId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inv1Id))))
                .andExpect(status().isBadRequest());

        // Reassigning to the same investigator is rejected
        mockMvc.perform(put("/api/admin/reports/" + reportId + "/reassign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inv2Id))))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/admin/reports/" + reportId + "/assignment-history")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void invalidIdsInactiveInvestigatorAndUnauthorizedRolesAreRejected() throws Exception {
        String adminToken = loginWithRole("admin.sec@example.com", "ADMIN");
        String citizenToken = registerCitizen("citizen.sec@example.com");
        String invToken = loginWithRole("inv.sec@example.com", "INVESTIGATOR");
        long reportId = submitReport(citizenToken);

        long inactiveInvId = createInvestigator(adminToken, "inv.inactive@cybertrace.in", "CYB-301", "BDG-301")
                .get("id").asLong();
        mockMvc.perform(patch("/api/admin/investigators/" + inactiveInvId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("accountStatus", "INACTIVE"))))
                .andExpect(status().isOk());

        // Inactive investigator cannot receive assignment
        mockMvc.perform(post("/api/admin/reports/" + reportId + "/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inactiveInvId))))
                .andExpect(status().isBadRequest());

        // Invalid report / investigator IDs
        mockMvc.perform(post("/api/admin/reports/999999/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("investigatorId", inactiveInvId))))
                .andExpect(status().isNotFound());

        // Citizen & Investigator denied (403), Unauthenticated denied (401)
        mockMvc.perform(get("/api/admin/investigators")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/reports")
                        .header("Authorization", "Bearer " + invToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/reports"))
                .andExpect(status().isUnauthorized());
    }
}
