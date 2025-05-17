package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.DepartmentStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Dean;
import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.StudentAffair;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.StudentList;
import com.iztech.gsmBackend.repository.*;
import com.iztech.gsmBackend.service.IDeanService;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

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

    @Autowired
    private IStudentAffairRepository studentAffairRepository;

    @Autowired
    private IStudentRepository studentRepository;

    @Override
    public List<DepartmentStatusDto> getDepartmentStatusesByFaculty(String faculty) {
        List<Secretary> secretaries = secretaryRepository.findAll().stream()
                .filter(s -> faculty.equalsIgnoreCase(s.getFaculty()))
                .toList();

        return secretaries.stream().map(secretary -> {
            boolean hasSent = !studentListRepository.findBySecretaryIdAndDeanIdIsNotNull(secretary.getId()).isEmpty();
            DepartmentStatusDto dto = new DepartmentStatusDto();
            dto.setSecretaryId(secretary.getId());
            dto.setName(secretary.getDepartment());
            dto.setStatus(hasSent ? "SENT" : "PENDING");
            return dto;
        }).toList();
    }

    @Override
    public void sendReminderToSecretary(Long secretaryId) {
        boolean alreadySent = !studentListRepository.findBySecretaryIdAndDeanIdIsNotNull(secretaryId).isEmpty();
        if (alreadySent) {
            throw new IllegalStateException("Student list already sent by secretary.");
        }

        String message = "Please send your approved student list to the dean's office.";
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

    @Override
    public void sendApprovedStudentsToStudentAffair(Long deanId) {
        Dean dean = deanRepository.findById(deanId)
                .orElseThrow(() -> new RuntimeException("Dean not found"));

        // 1. Tüm sekreterler bu deanin faculty'sinde mi student list gönderdi?
        List<Secretary> secretaries = secretaryRepository.findAll().stream()
                .filter(s -> dean.getFaculty().equalsIgnoreCase(s.getFaculty()))
                .toList();
        boolean allSecretariesSent = secretaries.stream()
                .allMatch(secretary -> !studentListRepository.findBySecretaryIdAndDeanIdIsNotNull(secretary.getId()).isEmpty());
        if (!allSecretariesSent) {
            throw new RuntimeException("You cannot send the student list to Student Affairs until all secretaries in your faculty have sent their student lists.");
        }

        // Sadece transcripti olan ve advisor/sekreter statusu APPROVED olan öğrenciler
        List<Student> approvedStudents = studentListRepository.findByDeanId(deanId).stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student ->
                        student.getAdvisorStatus() == STATUS.APPROVED &&
                        student.getSecretaryStatus() == STATUS.APPROVED &&
                        transcriptRepository.existsByStudentId(student.getId())
                )
                .collect(Collectors.toList());

        if (approvedStudents.isEmpty()) {
            throw new RuntimeException("There are no approved students to send.");
        }

        // StudentAffair bul (örnek: ilkini alıyoruz, istersen fakülteye göre filtreleyebilirsin)
        StudentAffair studentAffair = studentAffairRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Student Affair not found"));

        byte[] newContent = serializeStudentList(approvedStudents);

        List<StudentList> existingLists = studentListRepository.findByDeanIdAndStudentAffairIsNotNull(deanId);
        boolean isUpdate = !existingLists.isEmpty();

        for (StudentList list : existingLists) {
            if (Arrays.equals(list.getContent(), newContent)) {
                System.out.println("Identical student list already sent to Student Affair. Skipping save.");
                return;
            }
        }

        if (!existingLists.isEmpty()) {
            studentListRepository.deleteAll(existingLists);
        }

        StudentList studentList = new StudentList();
        studentList.setDean(dean);
        studentList.setStudentAffair(studentAffair);
        studentList.setFaculty(dean.getFaculty());
        studentList.setCreationDate(LocalDateTime.now());
        studentList.setStudents(approvedStudents);
        studentList.setContent(newContent);

        studentListRepository.save(studentList);

        // StudentAffair'e ulaştıktan sonra deanStatus'u APPROVED yap
        approvedStudents.forEach(student -> {
            student.setDeanStatus(STATUS.APPROVED);
            studentRepository.save(student);
        });

        String message;
        if (isUpdate) {
            message = "Dean " + dean.getFirstName() + " " + dean.getLastName() + " has sent an updated student list to Student Affairs.";
        } else {
            message = "Dean " + dean.getFirstName() + " " + dean.getLastName() + " has sent the approved student list to Student Affairs.";
        }
        notificationService.sendNotification(studentAffair.getId(), message);
    }

    private byte[] serializeStudentList(List<Student> students) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            List<Map<String, Object>> simpleList = students.stream()
                    .map(s -> {
                        Map<String, Object> studentMap = new HashMap<>();
                        studentMap.put("id", s.getId());
                        studentMap.put("studentNumber", s.getStudentNumber());
                        studentMap.put("firstName", s.getFirstName());
                        studentMap.put("lastName", s.getLastName());
                        studentMap.put("gpa", s.getGpa());
                        studentMap.put("department", s.getDepartment());
                        studentMap.put("faculty", s.getFaculty());
                        studentMap.put("ectsEarned", s.getEctsEarned());
                        studentMap.put("advisorStatus", s.getAdvisorStatus());
                        studentMap.put("secretaryStatus", s.getSecretaryStatus());
                        studentMap.put("deanStatus", s.getDeanStatus());
                        studentMap.put("studentAffairStatus", s.getStudentAffairStatus());
                        studentMap.put("enrollmentDate", s.getEnrollmentDate());
                        studentMap.put("graduationStatus", s.getGraduationStatus());
                        studentMap.put("email", s.getEmail());
                        studentMap.put("phone", s.getPhone());
                        studentMap.put("role", s.getRole());
                        return studentMap;
                    })
                    .sorted((a, b) -> a.get("id").toString().compareTo(b.get("id").toString()))
                    .toList();

            return mapper.writeValueAsBytes(simpleList);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to serialize student list", e);
        }
    }
}
