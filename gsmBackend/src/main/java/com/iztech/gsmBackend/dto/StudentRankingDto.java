package com.iztech.gsmBackend.dto;

import lombok.Data;

@Data
public class StudentRankingDto {
    private int departmentRank;
    private int departmentTotal;
    private int facultyRank;
    private int facultyTotal;
    private int universityRank;
    private int universityTotal;
} 