package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

public interface IAdvisorController {

    ResponseEntity<List<StudentDto>> getStudentsByAdvisor(Long advisorId);

    public ResponseEntity<String> sendStudentListToSecretary(@PathVariable Long advisorId);

}
