package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.dto.AdvisorStatusDto;

import java.util.List;

public interface ISecretaryService {
    List<AdvisorStatusDto> getAdvisorStatusesByDepartment(String department); // örnek dönüş: [AdvisorStatusDto, ...]
    void sendReminderToAdvisor(Long advisorId);

    List<StudentDto> getApprovedStudentsForSecretary(Long secretaryId);

    String getDepartmentBySecretaryId(Long secretaryId);

    void sendApprovedStudentsToDean(Long secretaryId);

    //void sendApprovedStudentsToDean(Long secretaryId);
}
