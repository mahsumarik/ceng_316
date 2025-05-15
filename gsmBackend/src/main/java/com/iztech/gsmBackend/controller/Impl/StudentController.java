package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IStudentController;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.ROLE;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.service.INotificationService;
import com.iztech.gsmBackend.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.iztech.gsmBackend.model.Student;

@RestController
@RequestMapping("/api/students")
public class StudentController implements IStudentController {

    @Autowired
    private IStudentService studentService;

    @Autowired
    private INotificationService notificationService;

    @Override
    @PostMapping("/{studentId}/upload-transcript")
    public ResponseEntity<String> uploadTranscript(@PathVariable Long studentId,
                                                   @RequestParam("file") MultipartFile file) throws Exception {
        studentService.uploadTranscript(studentId, file);
        return ResponseEntity.ok("Transcript uploaded successfully.");
    }

    @Override
    @GetMapping("/{studentId}/transcript")
    public ResponseEntity<byte[]> getTranscript(@PathVariable Long studentId) {
        try {
            byte[] content = studentService.getTranscript(studentId).getContent();
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .body(content);
        } catch (RuntimeException e) {
            notificationService.notifyStudentToUploadTranscript(studentId);
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    @DeleteMapping("/{studentId}/transcript")
    public ResponseEntity<String> deleteTranscript(@PathVariable Long studentId) {
        studentService.deleteTranscript(studentId); // Transkripti silme işlemi
        return ResponseEntity.ok("Transcript deleted successfully.");
    }

    @Override
    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long studentId) {
        StudentDto studentDTO = studentService.getStudentById(studentId);
        return ResponseEntity.ok(studentDTO);
    }

    @Override
    @PutMapping("/{studentId}/status")
    public ResponseEntity<String> updateStudentStatus(
            @PathVariable Long studentId,
            @RequestParam STATUS status,
            @RequestParam ROLE role
    ) {
        try {
            studentService.updateStudentStatus(studentId, status, role);
            notificationService.sendStudentNotification(studentId, status.name());
            return ResponseEntity.ok("Student status updated successfully for role: " + role.name());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update student status: " + e.getMessage());
        }
    }

}
