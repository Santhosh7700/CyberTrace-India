package com.cybertrace.india;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "app.jwt.secret=dGVzdC1qd3Qtc2VjcmV0LWtleS1mb3ItY3liZXJ0cmFjZS1pbmRpYS10ZXN0cy0yNTZiaXQ="
})
class CyberTraceBackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
