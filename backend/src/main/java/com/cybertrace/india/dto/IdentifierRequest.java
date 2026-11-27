package com.cybertrace.india.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class IdentifierRequest {

    @NotBlank(message = "Identifier type is required")
    private String type; // PHONE, UPI, EMAIL, URL

    @NotBlank(message = "Identifier value is required")
    @Size(max = 512, message = "Identifier value must not exceed 512 characters")
    private String value;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
