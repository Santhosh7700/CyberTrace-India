package com.cybertrace.india.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateInvestigatorStatusRequest {

    @NotBlank(message = "Account status is required")
    private String accountStatus; // ACTIVE, INACTIVE, SUSPENDED

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
}
