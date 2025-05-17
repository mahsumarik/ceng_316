package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.FacultyStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import java.util.List;

public interface IStudentAffairService {
    List<FacultyStatusDto> getFacultyStatuses();
    void sendReminderToDean(Long deanId);
    List<StudentDto> getApprovedStudentsForStudentAffair(Long studentAffairId);
    byte[] prepareDiploma(Long studentId, Long studentAffairId);
    void cancelDiploma(Long studentId);
    byte[] getDiplomaPdf(Long studentId);
    byte[] getStudentListPdf(Long studentAffairId);
    byte[] getAllDiplomasZip(Long studentAffairId);
}
