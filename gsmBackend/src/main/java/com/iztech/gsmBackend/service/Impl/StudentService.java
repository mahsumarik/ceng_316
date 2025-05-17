package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AdvisorDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.ROLE;
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

import static com.iztech.gsmBackend.enums.ROLE.*;

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
        dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
        dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
        dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
        dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
        dto.setFaculty(student.getFaculty());
        dto.setGraduationStatus(student.getGraduationStatus());

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
    public void updateStudentStatus(Long studentId, STATUS status, ROLE role) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        switch (role) {
            case ADVISOR -> student.setAdvisorStatus(status);
            case DEAN -> student.setDeanStatus(status);
            case SECRETARY -> student.setSecretaryStatus(status);
            case STUDENT_AFFAIRS -> student.setStudentAffairStatus(status);
            default -> throw new RuntimeException("This role cannot update status.");
        }

        studentRepository.save(student);
        notificationService.sendStudentNotification(studentId, status.name());
    }


}
