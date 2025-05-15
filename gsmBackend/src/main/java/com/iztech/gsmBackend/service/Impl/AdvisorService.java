package com.iztech.gsmBackend.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Advisor;
import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.StudentList;
import com.iztech.gsmBackend.repository.IAdvisorRepository;
import com.iztech.gsmBackend.repository.ISecretaryRepository;
import com.iztech.gsmBackend.repository.IStudentListRepository;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.service.IAdvisorService;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdvisorService implements IAdvisorService {

    @Autowired
    private IStudentRepository studentRepository;

    @Autowired
    private IAdvisorRepository advisorRepository;

    @Autowired
    private ISecretaryRepository secretaryRepository;

    @Autowired
    private IStudentListRepository studentListRepository;

    @Autowired
    private INotificationService notificationService;

    @Override
    public List<StudentDto> getStudentsByAdvisorId(Long advisorId) {
        return studentRepository.findByAdvisorId(advisorId).stream().map(student -> {
            StudentDto dto = new StudentDto();
            dto.setId(student.getId());
            dto.setFirstName(student.getFirstName());
            dto.setLastName(student.getLastName());
            dto.setGpa(student.getGpa());
            dto.setDepartment(student.getDepartment());
            dto.setFaculty(student.getFaculty());
            dto.setStudentNumber(student.getStudentNumber());
            dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
            dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
            dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
            dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
            dto.setEctsEarned(student.getEctsEarned());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void sendApprovedStudentsToSecretary(Long advisorId) {
        Advisor advisor = advisorRepository.findById(advisorId)
                .orElseThrow(() -> new RuntimeException("Advisor not found"));

        List<Student> approvedStudents = studentRepository.findByAdvisorId(advisorId).stream()
                .filter(s -> s.getAdvisorStatus() == STATUS.APPROVED)
                .collect(Collectors.toList());

        if (approvedStudents.isEmpty()) {
            throw new RuntimeException("No approved students to send.");
        }

        String department = advisor.getDepartment();

        Secretary secretary = secretaryRepository.findAll().stream()
                .filter(sec -> department.equalsIgnoreCase(sec.getDepartment()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Secretary not found for department: " + department));

        byte[] newContent = serializeStudentList(approvedStudents);

        List<StudentList> existingLists = studentListRepository.findByAdvisorIdAndSecretaryId(advisor.getId(), secretary.getId());

        for (StudentList list : existingLists) {
            if (Arrays.equals(list.getContent(), newContent)) {
                // Aynı içerik varsa, hata vermek yerine başarılı yanıt dön
                System.out.println("Identical student list already sent. Skipping save.");
                return;
            }
        }

        // Eğer farklıysa: eskileri sil
        if (!existingLists.isEmpty()) {
            studentListRepository.deleteAll(existingLists);
        }

        StudentList studentList = new StudentList();
        studentList.setAdvisor(advisor);
        studentList.setSecretary(secretary);
        studentList.setDepartment(department);
        studentList.setCreationDate(LocalDateTime.now());
        studentList.setStudents(approvedStudents);
        studentList.setContent(newContent);

        studentListRepository.save(studentList);

        String message = "Advisor " + advisor.getFirstName() + " " + advisor.getLastName() + " has sent the approved student list.";
        notificationService.sendNotification(secretary.getId(), message);
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
                    .sorted(Comparator.comparing((Map<String, Object> map) -> map.get("id").toString()))
                    .toList();

            return mapper.writeValueAsBytes(simpleList);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to serialize student list", e);
        }
    }


}

