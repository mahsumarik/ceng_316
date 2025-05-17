package com.iztech.gsmBackend.dto;

public class FacultyStatusDto {
    private Long facultyId;
    private String name;
    private String status; // SENT or PENDING

    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 