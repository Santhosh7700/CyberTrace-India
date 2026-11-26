package com.cybertrace.india.dto;

public class UserSummaryResponse {

    private Long id;
    private String email;
    private String role;
    private String accountStatus;
    private String fullName;

    public UserSummaryResponse() {}

    public UserSummaryResponse(Long id, String email, String role, String accountStatus, String fullName) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.accountStatus = accountStatus;
        this.fullName = fullName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
