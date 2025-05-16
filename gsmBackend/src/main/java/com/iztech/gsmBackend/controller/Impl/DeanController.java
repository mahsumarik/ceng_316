package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IDeanController;
import com.iztech.gsmBackend.dto.DepartmentStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.service.IDeanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dean")
public class DeanController implements IDeanController {

    @Autowired
    private IDeanService deanService;

    @Override
    @GetMapping("/department-statuses")
    public ResponseEntity<List<DepartmentStatusDto>> getDepartmentStatuses(@RequestParam String faculty) {
        return ResponseEntity.ok(deanService.getDepartmentStatusesByFaculty(faculty));
    }

    @Override
    @PostMapping("/notify-secretary")
    public ResponseEntity<String> notifySecretary(@RequestParam Long secretaryId) {
        try {
            deanService.sendReminderToSecretary(secretaryId);
            return ResponseEntity.ok("Notification sent to secretary.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/approved-students")
    public ResponseEntity<List<StudentDto>> getApprovedStudents(@RequestParam Long deanId) {
        return ResponseEntity.ok(deanService.getApprovedStudentsForDean(deanId));
    }

    @Override
    @GetMapping("/faculty")
    public ResponseEntity<String> getFaculty(@RequestParam Long deanId) {
        return ResponseEntity.ok(deanService.getFacultyByDeanId(deanId));
    }
}
