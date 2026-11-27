package com.cybertrace.india.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateInvestigatorRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    @NotBlank(message = "Cyber ID is required")
    @Size(max = 64, message = "Cyber ID must not exceed 64 characters")
    private String cyberId;

    @NotBlank(message = "Badge number is required")
    @Size(max = 64, message = "Badge number must not exceed 64 characters")
    private String badgeNumber;

    @NotBlank(message = "Display name is required")
    @Size(max = 150, message = "Display name must not exceed 150 characters")
    private String displayName;

    @Size(max = 150, message = "Rank title must not exceed 150 characters")
    private String rankTitle;

    @NotBlank(message = "Department is required")
    @Size(max = 150, message = "Department must not exceed 150 characters")
    private String department;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCyberId() { return cyberId; }
    public void setCyberId(String cyberId) { this.cyberId = cyberId; }
    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
