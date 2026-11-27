package com.cybertrace.india.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateInvestigatorRequest {

    @NotBlank(message = "Display name is required")
    @Size(max = 150, message = "Display name must not exceed 150 characters")
    private String displayName;

    @Size(max = 150, message = "Rank title must not exceed 150 characters")
    private String rankTitle;

    @NotBlank(message = "Department is required")
    @Size(max = 150, message = "Department must not exceed 150 characters")
    private String department;

    @Size(max = 32, message = "Availability status must not exceed 32 characters")
    private String availabilityStatus;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }
}
