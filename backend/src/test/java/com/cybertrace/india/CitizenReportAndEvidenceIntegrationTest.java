package com.cybertrace.india;

import com.cybertrace.india.entity.User;
import com.cybertrace.india.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "app.jwt.secret=dGVzdC1qd3Qtc2VjcmV0LWtleS1mb3ItY3liZXJ0cmFjZS1pbmRpYS10ZXN0cy0yNTZiaXQ=",
        "app.jwt.expiration-ms=3600000",
        "app.storage.local-dir=target/test-evidence-uploads"
})
class CitizenReportAndEvidenceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @AfterAll
    static void cleanupTestUploads() throws IOException {
        Path testUploadDir = Paths.get("target/test-evidence-uploads");
        if (Files.exists(testUploadDir)) {
            try (var stream = Files.walk(testUploadDir)) {
                stream.sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException ignored) {
                            }
                        });
            }
        }
    }

    private String registerCitizen(String email) throws Exception {
        Map<String, String> payload = Map.of(
                "fullName", "Citizen User",
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

    private JsonNode submitSampleReport(String token) throws Exception {
        Map<String, Object> reportPayload = Map.of(
                "scamCategory", "UPI Fraud",
                "description", "Fraudulent UPI collect request pretending to be a refund.",
                "financialLoss", 15000.50,
                "transactionId", "TXN9988776655",
                "platform", "PhonePe",
                "incidentDate", "2026-11-20",
                "priority", "HIGH",
                "identifiers", List.of(
                        Map.of("type", "UPI", "value", "Scammer@OkAxis"),
                        Map.of("type", "PHONE", "value", "+91 98765-43210"),
                        Map.of("type", "PHONE", "value", "9123456789"),
                        Map.of("type", "URL", "value", "HTTPS://Fake-Refund.Example.COM/pay")
                )
        );

        MvcResult result = mockMvc.perform(post("/api/citizen/reports")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reportPayload)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    @Test
    void submitReportAndRetrieveOwnReportsAndDetails() throws Exception {
        String token = registerCitizen("citizen.report1@example.com");
        JsonNode created = submitSampleReport(token);

        long reportId = created.get("id").asLong();
        String caseRef = created.get("caseReference").asText();

        assertThat(caseRef).startsWith("CTI-");
        assertThat(created.get("status").asText()).isEqualTo("SUBMITTED");
        assertThat(created.get("identifiers")).hasSize(4);
        assertThat(created.get("identifiers").get(0).get("normalizedValue").asText()).isEqualTo("scammer@okaxis");
        assertThat(created.get("identifiers").get(1).get("normalizedValue").asText()).isEqualTo("+919876543210");

        // List own reports
        mockMvc.perform(get("/api/citizen/reports")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].caseReference").value(caseRef));

        // Get by ID
        mockMvc.perform(get("/api/citizen/reports/" + reportId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(reportId))
                .andExpect(jsonPath("$.identifiers.length()").value(4));

        // Get by case reference
        mockMvc.perform(get("/api/citizen/reports/reference/" + caseRef)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caseReference").value(caseRef));
    }

    @Test
    void uploadRetrieveMetadataAndDownloadEvidence() throws Exception {
        String token = registerCitizen("citizen.evidence1@example.com");
        JsonNode created = submitSampleReport(token);
        long reportId = created.get("id").asLong();

        byte[] fileBytes = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00};
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "screenshot.png",
                "image/png",
                fileBytes
        );

        MvcResult uploadRes = mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.originalFilename").value("screenshot.png"))
                .andExpect(jsonPath("$.fileType").value("image/png"))
                .andExpect(jsonPath("$.storagePath").doesNotExist())
                .andReturn();

        long evidenceId = objectMapper.readTree(uploadRes.getResponse().getContentAsString()).get("id").asLong();

        // List evidence for report
        mockMvc.perform(get("/api/citizen/reports/" + reportId + "/evidence")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // Get evidence metadata
        mockMvc.perform(get("/api/citizen/evidence/" + evidenceId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(evidenceId))
                .andExpect(jsonPath("$.storagePath").doesNotExist());

        // Download / preview evidence
        mockMvc.perform(get("/api/citizen/evidence/" + evidenceId + "/download?disposition=attachment")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"screenshot.png\""))
                .andExpect(content().bytes(fileBytes));
    }

    @Test
    void invalidReportDataAndInvalidEvidenceAreRejected() throws Exception {
        String token = registerCitizen("citizen.invalid@example.com");

        // Missing required fields
        Map<String, Object> invalidReport = Map.of("scamCategory", "");
        mockMvc.perform(post("/api/citizen/reports")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReport)))
                .andExpect(status().isBadRequest());

        JsonNode created = submitSampleReport(token);
        long reportId = created.get("id").asLong();

        // Invalid file type
        MockMultipartFile exeFile = new MockMultipartFile(
                "file",
                "malware.exe",
                "application/x-msdownload",
                "MZ".getBytes(StandardCharsets.UTF_8)
        );
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(exeFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        // Oversized file (> 10 MB)
        byte[] oversized = new byte[10 * 1024 * 1024 + 10];
        MockMultipartFile largeFile = new MockMultipartFile("file", "large.pdf", "application/pdf", oversized);
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(largeFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unauthenticatedAndNonCitizenAccessAreDenied() throws Exception {
        mockMvc.perform(get("/api/citizen/reports")).andExpect(status().isUnauthorized());

        String invToken = loginWithRole("inv.denied@example.com", "INVESTIGATOR");
        mockMvc.perform(get("/api/citizen/reports")
                        .header("Authorization", "Bearer " + invToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void citizenCannotAccessAnotherCitizensReportOrEvidence() throws Exception {
        String ownerToken = registerCitizen("owner.citizen@example.com");
        String otherToken = registerCitizen("other.citizen@example.com");

        JsonNode created = submitSampleReport(ownerToken);
        long reportId = created.get("id").asLong();

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "proof.txt",
                "text/plain",
                "proof".getBytes(StandardCharsets.UTF_8)
        );
        MvcResult uploadRes = mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(file)
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isCreated())
                .andReturn();
        long evidenceId = objectMapper.readTree(uploadRes.getResponse().getContentAsString()).get("id").asLong();

        // Other citizen cannot view report
        mockMvc.perform(get("/api/citizen/reports/" + reportId)
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());

        // Other citizen cannot list, view metadata, or download evidence
        mockMvc.perform(get("/api/citizen/reports/" + reportId + "/evidence")
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/citizen/evidence/" + evidenceId)
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/citizen/evidence/" + evidenceId + "/download")
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void allAllowedFileTypesWithValidSignaturesSucceed() throws Exception {
        String token = registerCitizen("citizen.alltypes@example.com");
        long reportId = submitSampleReport(token).get("id").asLong();

        List<MockMultipartFile> validFiles = List.of(
                new MockMultipartFile("file", "photo.jpg", "image/jpeg", new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0}),
                new MockMultipartFile("file", "img.png", "image/png", new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}),
                new MockMultipartFile("file", "pic.webp", "image/webp", new byte[]{'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P'}),
                new MockMultipartFile("file", "doc.pdf", "application/pdf", "%PDF-1.7\n".getBytes(StandardCharsets.UTF_8)),
                new MockMultipartFile("file", "notes.txt", "text/plain", "Scam call log\nLine 2".getBytes(StandardCharsets.UTF_8)),
                new MockMultipartFile("file", "clip.mp4", "video/mp4", new byte[]{0, 0, 0, 0x18, 'f', 't', 'y', 'p', 'm', 'p', '4', '2'})
        );

        for (MockMultipartFile validFile : validFiles) {
            mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                            .file(validFile)
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isCreated());
        }
    }

    @Test
    void fakeMimeTypeMismatchedExtensionAndEmptyFileAreRejected() throws Exception {
        String token = registerCitizen("citizen.spoof@example.com");
        long reportId = submitSampleReport(token).get("id").asLong();

        // Fake MIME type: claims image/png, actually plain text
        MockMultipartFile spoofedPng = new MockMultipartFile(
                "file", "fake.png", "image/png", "not a png".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(spoofedPng)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        // Mismatched extension: .jpg with image/png
        MockMultipartFile mismatchedExt = new MockMultipartFile(
                "file", "wrong.jpg", "image/png", new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A});
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(mismatchedExt)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        // Binary data disguised as text/plain
        MockMultipartFile binaryTxt = new MockMultipartFile(
                "file", "binary.txt", "text/plain", new byte[]{0x41, 0x00, 0x42});
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(binaryTxt)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());

        // Empty file
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", "empty.txt", "text/plain", new byte[0]);
        mockMvc.perform(multipart("/api/citizen/reports/" + reportId + "/evidence")
                        .file(emptyFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void pathTraversalIsBlockedInLocalStorageService() {
        com.cybertrace.india.service.LocalStorageService storage =
                new com.cybertrace.india.service.LocalStorageService("target/test-evidence-uploads");
        org.junit.jupiter.api.Assertions.assertThrows(
                com.cybertrace.india.exception.ResourceNotFoundException.class,
                () -> storage.loadAsResource("../application.yml")
        );
        org.junit.jupiter.api.Assertions.assertThrows(
                com.cybertrace.india.exception.ResourceNotFoundException.class,
                () -> storage.loadAsResource("..\\application.yml")
        );
    }

    @Test
    void orphanedFileIsCleanedUpWhenDatabasePersistenceFails() {
        com.cybertrace.india.service.StorageService mockStorage =
                org.mockito.Mockito.mock(com.cybertrace.india.service.StorageService.class);
        com.cybertrace.india.repository.EvidenceFileRepository mockEvidenceRepo =
                org.mockito.Mockito.mock(com.cybertrace.india.repository.EvidenceFileRepository.class);
        com.cybertrace.india.repository.ScamReportRepository mockReportRepo =
                org.mockito.Mockito.mock(com.cybertrace.india.repository.ScamReportRepository.class);
        com.cybertrace.india.service.CitizenReportService mockReportService =
                org.mockito.Mockito.mock(com.cybertrace.india.service.CitizenReportService.class);

        com.cybertrace.india.entity.CitizenProfile citizen = new com.cybertrace.india.entity.CitizenProfile();
        citizen.setId(1L);
        com.cybertrace.india.entity.ScamReport report = new com.cybertrace.india.entity.ScamReport();
        report.setId(10L);
        report.setCaseReference("CTI-2026-TEST01");
        report.setCitizen(citizen);

        org.mockito.Mockito.when(mockReportService.resolveCitizenProfile("c@example.com")).thenReturn(citizen);
        org.mockito.Mockito.when(mockReportRepo.findByIdAndCitizenId(10L, 1L)).thenReturn(java.util.Optional.of(report));
        org.mockito.Mockito.when(mockStorage.store(
                org.mockito.ArgumentMatchers.eq("CTI-2026-TEST01"),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.eq("text/plain"),
                org.mockito.ArgumentMatchers.anyLong()))
                .thenReturn("CTI-2026-TEST01/uuid.txt");
        org.mockito.Mockito.when(mockEvidenceRepo.save(org.mockito.ArgumentMatchers.any()))
                .thenThrow(new RuntimeException("Simulated DB failure"));

        com.cybertrace.india.service.CitizenEvidenceService service =
                new com.cybertrace.india.service.CitizenEvidenceService(
                        mockReportService, mockReportRepo, mockEvidenceRepo, mockStorage);

        MockMultipartFile txtFile = new MockMultipartFile(
                "file", "proof.txt", "text/plain", "valid text".getBytes(StandardCharsets.UTF_8));

        org.junit.jupiter.api.Assertions.assertThrows(
                RuntimeException.class,
                () -> service.uploadEvidence("c@example.com", 10L, txtFile)
        );
        org.mockito.Mockito.verify(mockStorage).delete("CTI-2026-TEST01/uuid.txt");
    }
}
