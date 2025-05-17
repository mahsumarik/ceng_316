package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.FacultyStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

public interface IStudentAffairController {
    ResponseEntity<List<FacultyStatusDto>> getFacultyStatuses();
    ResponseEntity<String> notifyDean(@RequestParam Long deanId);
    ResponseEntity<List<StudentDto>> getApprovedStudents(@RequestParam Long studentAffairId);
}
