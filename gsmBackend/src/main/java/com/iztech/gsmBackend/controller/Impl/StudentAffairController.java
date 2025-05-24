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

    @Override
    @PostMapping("/prepare-diploma/{studentId}")
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
    public ResponseEntity<byte[]> prepareDiploma(@PathVariable Long studentId, @RequestParam Long studentAffairId) {
        try {
            byte[] pdf = studentAffairService.prepareDiploma(studentId, studentAffairId);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=diploma.pdf")
                .header("Content-Length", String.valueOf(pdf.length))
                .header("Access-Control-Expose-Headers", "Content-Disposition, Content-Length")
                .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @Override
    @DeleteMapping("/cancel-diploma/{studentId}")
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.OPTIONS})
    public ResponseEntity<String> cancelDiploma(@PathVariable Long studentId) {
        try {
            studentAffairService.cancelDiploma(studentId);
            return ResponseEntity.ok("Diploma cancelled and status reverted.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @Override
    @GetMapping("/diploma/{studentId}")
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
    public ResponseEntity<byte[]> downloadDiploma(@PathVariable Long studentId) {
        try {
            byte[] pdf = studentAffairService.getDiplomaPdf(studentId);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=diploma.pdf")
                .header("Content-Length", String.valueOf(pdf.length))
                .header("Access-Control-Expose-Headers", "Content-Disposition, Content-Length")
                .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @Override
    @GetMapping("/diploma/view/{studentId}")
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.OPTIONS})
    public ResponseEntity<byte[]> viewDiploma(@PathVariable Long studentId) {
        try {
            byte[] pdf = studentAffairService.getDiplomaPdf(studentId);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=diploma.pdf")
                .header("Content-Length", String.valueOf(pdf.length))
                .header("Access-Control-Expose-Headers", "Content-Disposition, Content-Length")
                .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @Override
    @GetMapping("/download-student-list")
    public ResponseEntity<byte[]> downloadStudentList(@RequestParam Long studentAffairId) {
        byte[] pdf = studentAffairService.getStudentListPdf(studentAffairId);
        return ResponseEntity.ok()
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", "attachment; filename=student_list.pdf")
            .body(pdf);
    }

    @GetMapping("/download-all-diplomas")
    public ResponseEntity<byte[]> downloadAllDiplomas(@RequestParam Long studentAffairId) {
        byte[] zip = studentAffairService.getAllDiplomasZip(studentAffairId);
        return ResponseEntity.ok()
            .header("Content-Type", "application/zip")
            .header("Content-Disposition", "attachment; filename=all_diplomas.zip")
            .body(zip);
    }
}
