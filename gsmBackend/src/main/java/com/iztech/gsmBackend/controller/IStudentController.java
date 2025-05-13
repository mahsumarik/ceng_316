package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

public interface IStudentController {
    ResponseEntity<String> uploadTranscript(Long studentId, MultipartFile file) throws Exception;

    ResponseEntity<byte[]> getTranscript(Long studentId);

    ResponseEntity<String> deleteTranscript(@PathVariable Long studentId);

    ResponseEntity<StudentDto> getStudentById(@PathVariable Long studentId);

    ResponseEntity<String> approveStudent(@PathVariable Long studentId);

    ResponseEntity<String> rejectStudent(@PathVariable Long studentId);
}
