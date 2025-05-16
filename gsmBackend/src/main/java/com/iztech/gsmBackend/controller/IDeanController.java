package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.DepartmentStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IDeanController {
    ResponseEntity<List<DepartmentStatusDto>> getDepartmentStatuses(@RequestParam String faculty);
    ResponseEntity<String> notifySecretary(@RequestParam Long secretaryId);
    ResponseEntity<List<StudentDto>> getApprovedStudents(@RequestParam Long deanId);
    ResponseEntity<String> getFaculty(@RequestParam Long deanId);
}
