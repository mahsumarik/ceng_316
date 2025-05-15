package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.StudentDto;

import java.util.List;

public interface IAdvisorService {
    List<StudentDto> getStudentsByAdvisorId(Long advisorId);
    void sendApprovedStudentsToSecretary(Long advisorId);
}
