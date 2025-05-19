package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AdvisorStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Advisor;
import com.iztech.gsmBackend.model.Dean;
import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.StudentList;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.repository.IAdvisorRepository;
import com.iztech.gsmBackend.repository.IDeanRepository;
import com.iztech.gsmBackend.repository.ISecretaryRepository;
import com.iztech.gsmBackend.repository.IStudentListRepository;
import com.iztech.gsmBackend.repository.ITranscriptRepository;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.service.INotificationService;
import com.iztech.gsmBackend.service.ISecretaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

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

    @Autowired
    private IDeanRepository deanRepository;

    @Autowired
    private IStudentRepository studentRepository;
    
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
                .sorted((s1, s2) -> Double.compare(s2.getGpa(), s1.getGpa()))
                .collect(Collectors.toList());
    }
    @Override
    public String getDepartmentBySecretaryId(Long secretaryId) {
        Secretary secretary = secretaryRepository.findById(secretaryId)
                .orElseThrow(() -> new RuntimeException("Secretary not found"));
        return secretary.getDepartment();
    }

    @Override
    public void sendApprovedStudentsToDean(Long secretaryId) {
        Secretary secretary = secretaryRepository.findById(secretaryId)
                .orElseThrow(() -> new RuntimeException("Secretary not found"));

        List<Student> approvedStudents = studentListRepository.findBySecretaryId(secretaryId).stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student -> student.getAdvisorStatus() == STATUS.APPROVED)
                .collect(Collectors.toList());

        if (approvedStudents.isEmpty()) {
            throw new RuntimeException("There are no approved students to send.");
        }

        // Sadece dekan'a gönderilen öğrencilerin secretaryStatus'ünü APPROVED yap
        approvedStudents.forEach(student -> {
            student.setSecretaryStatus(STATUS.APPROVED);
            studentRepository.save(student);
        });

        Dean dean = deanRepository.findAll().stream()
                .filter(d -> secretary.getFaculty().equalsIgnoreCase(d.getFaculty()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Dean not found for faculty: " + secretary.getFaculty()));

        byte[] newContent = serializeStudentList(approvedStudents);

        List<StudentList> existingLists = studentListRepository.findBySecretaryIdAndDeanIdIsNotNull(secretaryId);
        boolean isUpdate = !existingLists.isEmpty();

        for (StudentList list : existingLists) {
            if (Arrays.equals(list.getContent(), newContent)) {
                System.out.println("Identical student list already sent to Dean. Skipping save.");
                return;
            }
        }

        if (!existingLists.isEmpty()) {
            studentListRepository.deleteAll(existingLists);
        }

        StudentList studentList = new StudentList();
        studentList.setSecretary(secretary);
        studentList.setDean(dean);
        studentList.setDepartment(secretary.getDepartment());
        studentList.setFaculty(secretary.getFaculty());
        studentList.setCreationDate(LocalDateTime.now());
        studentList.setStudents(approvedStudents);
        studentList.setContent(newContent);

        studentListRepository.save(studentList);

        String message;
        if (isUpdate) {
            message = "Secretary " + secretary.getFirstName() + " " + secretary.getLastName() + " has sent an updated student list to Dean's office.";
        } else {
            message = "Secretary " + secretary.getFirstName() + " " + secretary.getLastName() + " has sent the approved student list to Dean's office.";
        }
        notificationService.sendNotification(dean.getId(), message);
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
