package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.DepartmentStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Dean;
import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.repository.IDeanRepository;
import com.iztech.gsmBackend.repository.ISecretaryRepository;
import com.iztech.gsmBackend.repository.IStudentListRepository;
import com.iztech.gsmBackend.repository.ITranscriptRepository;
import com.iztech.gsmBackend.service.IDeanService;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeanService implements IDeanService {

    @Autowired
    private IDeanRepository deanRepository;

    @Autowired
    private ISecretaryRepository secretaryRepository;

    @Autowired
    private IStudentListRepository studentListRepository;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private ITranscriptRepository transcriptRepository;

    @Override
    public List<DepartmentStatusDto> getDepartmentStatusesByFaculty(String faculty) {
        List<Secretary> secretaries = secretaryRepository.findAll().stream()
                .filter(s -> faculty.equalsIgnoreCase(s.getFaculty()))
                .toList();

        return secretaries.stream().map(secretary -> {
            boolean hasSent = !studentListRepository.findBySecretaryId(secretary.getId()).isEmpty();
            DepartmentStatusDto dto = new DepartmentStatusDto();
            dto.setSecretaryId(secretary.getId());
            dto.setName(secretary.getDepartment());
            dto.setStatus(hasSent ? "SENT" : "PENDING");
            return dto;
        }).toList();
    }

    @Override
    public void sendReminderToSecretary(Long secretaryId) {
        boolean alreadySent = !studentListRepository.findBySecretaryId(secretaryId).isEmpty();
        if (alreadySent) {
            throw new IllegalStateException("Student list already sent by secretary.");
        }

        String message = "Please send your approved student list to the dean.";
        notificationService.sendNotification(secretaryId, message);
    }

    @Override
    public List<StudentDto> getApprovedStudentsForDean(Long deanId) {
        return studentListRepository.findByDeanId(deanId).stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student -> transcriptRepository.existsByStudentId(student.getId()))
                .map(student -> {
                    StudentDto dto = new StudentDto();
                    dto.setId(student.getId());
                    dto.setFirstName(student.getFirstName());
                    dto.setLastName(student.getLastName());
                    dto.setGpa(student.getGpa());
                    dto.setStudentNumber(student.getStudentNumber());
                    dto.setDepartment(student.getDepartment());
                    dto.setFaculty(student.getFaculty());
                    dto.setEctsEarned(student.getEctsEarned());
                    dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
                    dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
                    dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
                    dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
                    return dto;
                })
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public String getFacultyByDeanId(Long deanId) {
        Dean dean = deanRepository.findById(deanId)
                .orElseThrow(() -> new RuntimeException("Dean not found"));
        return dean.getFaculty();
    }
}
