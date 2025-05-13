package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IStudentController;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentController implements IStudentController {

    @Autowired
    private IStudentService studentService;

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
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")  // Dosyanın türünü belirtiyoruz
                .body(studentService.getTranscript(studentId).getContent());
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
    @PutMapping("/{studentId}/approve")
    public ResponseEntity<String> approveStudent(@PathVariable Long studentId) {
        studentService.updateStudentStatus(studentId, STATUS.APPROVED);
        return ResponseEntity.ok("Student approved");
    }

    @Override
    @PutMapping("/{studentId}/reject")
    public ResponseEntity<String> rejectStudent(@PathVariable Long studentId) {
        studentService.updateStudentStatus(studentId, STATUS.REJECTED);
        return ResponseEntity.ok("Student rejected");
    }

}
