package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.DepartmentStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;

import java.util.List;

public interface IDeanService {
    List<DepartmentStatusDto> getDepartmentStatusesByFaculty(String faculty);
    void sendReminderToSecretary(Long secretaryId);
    List<StudentDto> getApprovedStudentsForDean(Long deanId);
    String getFacultyByDeanId(Long deanId);
}
