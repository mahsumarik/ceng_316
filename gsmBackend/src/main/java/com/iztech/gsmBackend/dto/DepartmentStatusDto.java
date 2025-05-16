package com.iztech.gsmBackend.dto;

public class DepartmentStatusDto {
    private Long secretaryId;
    private String name;
    private String status; // "SENT" veya "PENDING"

    public Long getSecretaryId() { return secretaryId; }
    public void setSecretaryId(Long secretaryId) { this.secretaryId = secretaryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
