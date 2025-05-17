package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.FacultyStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface IStudentAffairController {
    ResponseEntity<List<FacultyStatusDto>> getFacultyStatuses();
    ResponseEntity<String> notifyDean(@RequestParam Long deanId);
    ResponseEntity<List<StudentDto>> getApprovedStudents(@RequestParam Long studentAffairId);

    @PostMapping("/prepare-diploma/{studentId}")
    ResponseEntity<byte[]> prepareDiploma(@PathVariable Long studentId, @RequestParam Long studentAffairId);

    @DeleteMapping("/cancel-diploma/{studentId}")
    ResponseEntity<String> cancelDiploma(@PathVariable Long studentId);

    @GetMapping("/diploma/{studentId}")
    ResponseEntity<byte[]> downloadDiploma(@PathVariable Long studentId);

    @GetMapping("/diploma/view/{studentId}")
    ResponseEntity<byte[]> viewDiploma(@PathVariable Long studentId);

    @GetMapping("/download-student-list")
    ResponseEntity<byte[]> downloadStudentList(@RequestParam Long studentAffairId);
}
