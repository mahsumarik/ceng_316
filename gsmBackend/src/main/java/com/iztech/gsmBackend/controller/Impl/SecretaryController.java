package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.ISecretaryController;
import com.iztech.gsmBackend.service.ISecretaryService;
import com.iztech.gsmBackend.dto.AdvisorStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretary")
public class SecretaryController implements ISecretaryController {

    @Autowired
    private ISecretaryService secretaryService;


    @Override
    @GetMapping("/advisor-statuses")
    public ResponseEntity<List<AdvisorStatusDto>> getAdvisorStatuses(@RequestParam String department) {
        return ResponseEntity.ok(secretaryService.getAdvisorStatusesByDepartment(department));
    }

    @Override
    @PostMapping("/notify-advisor")
    public ResponseEntity<String> notifyAdvisor(@RequestParam Long advisorId) {
        try {
            secretaryService.sendReminderToAdvisor(advisorId);
            return ResponseEntity.ok("Notification sent to advisor.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/approved-students")
    public ResponseEntity<?> getApprovedStudents(@RequestParam Long secretaryId) {
        return ResponseEntity.ok(secretaryService.getApprovedStudentsForSecretary(secretaryId));
    }

    @Override
    @GetMapping("/department")
    public ResponseEntity<String> getDepartment(@RequestParam Long secretaryId) {
        return ResponseEntity.ok(secretaryService.getDepartmentBySecretaryId(secretaryId));
    }

    @Override
    @PostMapping("/send-to-dean")
    public ResponseEntity<String> sendStudentListToDean(@RequestParam Long secretaryId) {
        secretaryService.sendApprovedStudentsToDean(secretaryId);
        return ResponseEntity.ok("Approved students sent to dean.");
    }

}
