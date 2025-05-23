package com.iztech.gsmBackend.dto;

import lombok.Data;

@Data
public class StudentDto {
    private Long id;
    private String firstName;
    private String lastName;
    private Double gpa;
    private String department;
    private String faculty;
    private int ectsEarned;
    private AdvisorDto advisorDto;
    private String studentNumber;
    private String advisorStatus;
    private String secretaryStatus;
    private String deanStatus;
    private String studentAffairStatus;
    private Boolean graduationStatus;
}
