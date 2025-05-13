package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface IAdvisorController {
    ResponseEntity<List<StudentDto>> getStudentsByAdvisor(Long advisorId);
}
