package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.ROLE;
import com.iztech.gsmBackend.enums.STATUS;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.dto.StudentRankingDto;

public interface IStudentController {
    ResponseEntity<String> uploadTranscript(Long studentId, MultipartFile file) throws Exception;
    ResponseEntity<byte[]> getTranscript(Long studentId);
    ResponseEntity<String> deleteTranscript(@PathVariable Long studentId);

    ResponseEntity<StudentDto> getStudentById(@PathVariable Long studentId);
    ResponseEntity<String> updateStudentStatus(@PathVariable Long studentId, STATUS status, ROLE role);

    ResponseEntity<StudentRankingDto> getStudentRanking(@PathVariable Long studentId);

}
