package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IStudentAffairController;
import com.iztech.gsmBackend.dto.FacultyStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.service.IStudentAffairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/studentAffair")
public class StudentAffairController implements IStudentAffairController {

    @Autowired
    private IStudentAffairService studentAffairService;

    @Override
    @GetMapping("/faculty-statuses")
    public ResponseEntity<List<FacultyStatusDto>> getFacultyStatuses() {
        return ResponseEntity.ok(studentAffairService.getFacultyStatuses());
    }

    @Override
    @PostMapping("/notify-dean")
    public ResponseEntity<String> notifyDean(@RequestParam Long deanId) {
        try {
            studentAffairService.sendReminderToDean(deanId);
            return ResponseEntity.ok("Notification sent to dean.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/approved-students")
    public ResponseEntity<List<StudentDto>> getApprovedStudents(@RequestParam Long studentAffairId) {
        return ResponseEntity.ok(studentAffairService.getApprovedStudentsForStudentAffair(studentAffairId));
    }
}
