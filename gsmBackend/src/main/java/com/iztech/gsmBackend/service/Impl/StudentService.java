package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.Transcript;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.repository.ITranscriptRepository;
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
}
