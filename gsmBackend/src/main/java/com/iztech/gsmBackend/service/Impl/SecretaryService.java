package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AdvisorStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Advisor;
import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.StudentList;
import com.iztech.gsmBackend.repository.IAdvisorRepository;
import com.iztech.gsmBackend.repository.ISecretaryRepository;
import com.iztech.gsmBackend.repository.IStudentListRepository;
import com.iztech.gsmBackend.repository.ITranscriptRepository;
import com.iztech.gsmBackend.service.INotificationService;
import com.iztech.gsmBackend.service.ISecretaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecretaryService implements ISecretaryService {

    @Autowired
    private IAdvisorRepository advisorRepository;

    @Autowired
    private IStudentListRepository studentListRepository;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private ISecretaryRepository secretaryRepository;

    @Autowired
    private ITranscriptRepository transcriptRepository;
    
    @Override
    public List<AdvisorStatusDto> getAdvisorStatusesByDepartment(String department) {
        List<Advisor> advisors = advisorRepository.findAll().stream()
                .filter(a -> department.equalsIgnoreCase(a.getDepartment()))
                .toList();

        return advisors.stream().map(advisor -> {
            boolean hasSent = !studentListRepository.findByAdvisorId(advisor.getId()).isEmpty();
            AdvisorStatusDto dto = new AdvisorStatusDto();
            dto.setAdvisorId(advisor.getId());
            dto.setName(advisor.getFirstName() + " " + advisor.getLastName());
            dto.setStatus(hasSent ? "SENT" : "PENDING");
            return dto;
        }).toList();
    }

    @Override
    public void sendReminderToAdvisor(Long advisorId) {
        Advisor advisor = advisorRepository.findById(advisorId)
                .orElseThrow(() -> new RuntimeException("Advisor not found"));

        boolean alreadySent = !studentListRepository.findByAdvisorId(advisorId).isEmpty();
        if (alreadySent) {
            throw new IllegalStateException("Student list already sent by advisor.");
        }

        String message = "Please send your approved student list to the secretary.";
        notificationService.sendNotification(advisorId, message);
    }

    @Override
    public List<StudentDto> getApprovedStudentsForSecretary(Long secretaryId) {

        List<StudentList> lists = studentListRepository.findBySecretaryId(secretaryId);


        return lists.stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student ->
                        student.getAdvisorStatus() == STATUS.APPROVED &&
                                transcriptRepository.existsByStudentId(student.getId())
                )
                .map(student -> {
                    StudentDto dto = new StudentDto();
                    dto.setId(student.getId());
                    dto.setFirstName(student.getFirstName());
                    dto.setLastName(student.getLastName());
                    dto.setGpa(student.getGpa());
                    dto.setStudentNumber(student.getStudentNumber());
                    dto.setDepartment(student.getDepartment());
                    dto.setEctsEarned(student.getEctsEarned());
                    dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
                    dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
                    dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
                    dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
                    dto.setFaculty(student.getFaculty());
                    return dto;
                })
                .distinct()
                .collect(Collectors.toList());
    }
    @Override
    public String getDepartmentBySecretaryId(Long secretaryId) {
        Secretary secretary = secretaryRepository.findById(secretaryId)
                .orElseThrow(() -> new RuntimeException("Secretary not found"));
        return secretary.getDepartment();
    }
}
