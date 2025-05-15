package com.iztech.gsmBackend.dto;

public class AdvisorStatusDto {
    private Long advisorId;
    private String name;
    private String status; // "SENT" veya "PENDING"

    public Long getAdvisorId() { return advisorId; }
    public void setAdvisorId(Long advisorId) { this.advisorId = advisorId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 