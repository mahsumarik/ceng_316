package com.iztech.gsmBackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface IStudentController {
    ResponseEntity<String> uploadTranscript(Long studentId, MultipartFile file) throws Exception;

    ResponseEntity<byte[]> getTranscript(Long studentId);
}
