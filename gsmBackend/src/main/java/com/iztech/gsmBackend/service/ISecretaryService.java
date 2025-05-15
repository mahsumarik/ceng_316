package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.StudentDto;

import java.util.List;

public interface ISecretaryService {
    List<String> getAdvisorStatusesByDepartment(String department); // örnek dönüş: ["Dr. Ahmet - SENT", "Prof. Ayşe - PENDING"]
    void sendReminderToAdvisor(Long advisorId);

    List<StudentDto> getApprovedStudentsForSecretary(Long secretaryId);

    String getDepartmentBySecretaryId(Long secretaryId);
}
