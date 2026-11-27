package com.cybertrace.india.dto;

import java.time.OffsetDateTime;

public class IdentifierResponse {

    private Long id;
    private String type;
    private String originalValue;
    private String normalizedValue;
    private OffsetDateTime createdAt;

    public IdentifierResponse() {}

    public IdentifierResponse(Long id, String type, String originalValue, String normalizedValue, OffsetDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.originalValue = originalValue;
        this.normalizedValue = normalizedValue;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getOriginalValue() { return originalValue; }
    public void setOriginalValue(String originalValue) { this.originalValue = originalValue; }
    public String getNormalizedValue() { return normalizedValue; }
    public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
