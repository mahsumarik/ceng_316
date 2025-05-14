package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AdvisorDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.Transcript;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.repository.ITranscriptRepository;
import com.iztech.gsmBackend.service.INotificationService;
import com.iztech.gsmBackend.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class StudentService implements IStudentService {

    @Autowired
    private IStudentRepository studentRepository;

    @Autowired
    private ITranscriptRepository transcriptRepository;

    @Autowired
    private INotificationService notificationService;


    @Override
    public void uploadTranscript(Long studentId, MultipartFile file) throws IOException {
        // Öğrenci kontrolü
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        if (studentOptional.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        Student student = studentOptional.get();
        // Transkript oluşturuluyor
        Transcript transcript = new Transcript();
        transcript.setStudent(student);
        transcript.setContent(file.getBytes());  // Dosya içeriği byte[] olarak saklanır
        // Transkript veritabanına kaydediliyor
        transcriptRepository.save(transcript);
    }

    @Override
    public Transcript getTranscript(Long studentId) {
        Optional<Transcript> transcript = transcriptRepository.findByStudentId(studentId);
        if (transcript.isEmpty()) {
            throw new RuntimeException("Transcript not found for the student");
        }
        return transcript.get();
    }

    @Override
    public void deleteTranscript(Long studentId) {
        Optional<Transcript> transcriptOptional = transcriptRepository.findByStudentId(studentId);
        if (transcriptOptional.isEmpty()) {
            throw new RuntimeException("Transcript not found for the student");
        }
        Transcript transcript = transcriptOptional.get();
        transcriptRepository.delete(transcript); // Veritabanından silme işlemi
    }

    @Override
    public StudentDto getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setGpa(student.getGpa());
        dto.setDepartment(student.getDepartment());
        dto.setEctsEarned(student.getEctsEarned());
        dto.setStatus(student.getStatus() != null ? student.getStatus().name() : "PENDING");
        dto.setFaculty(student.getFaculty());

        if (student.getAdvisor() != null) {
            AdvisorDto advisorDto = new AdvisorDto();
            advisorDto.setId(student.getAdvisor().getId());
            advisorDto.setFirstName(student.getAdvisor().getFirstName());
            advisorDto.setLastName(student.getAdvisor().getLastName());
            dto.setAdvisorDto(advisorDto);
        }
        return dto;
    }

    @Override
    public void updateStudentStatus(Long studentId, STATUS status) {
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

            // Status değerini string olarak kontrol et
            String statusStr = status.name();
            if (!statusStr.equals("PENDING") && !statusStr.equals("APPROVED") && !statusStr.equals("REJECTED")) {
                throw new RuntimeException("Invalid status value: " + statusStr);
            }

            student.setStatus(status);
            studentRepository.save(student);
            notificationService.sendStudentNotification(studentId, status.name());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update student status: " + e.getMessage());
        }
    }

}
