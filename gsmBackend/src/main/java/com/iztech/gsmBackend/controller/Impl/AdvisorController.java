package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IAdvisorController;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.service.IAdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advisors")
public class AdvisorController implements IAdvisorController {

    @Autowired
    private IAdvisorService advisorService;

    @Override
    @GetMapping("/{advisorId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsByAdvisor(@PathVariable Long advisorId) {
        return ResponseEntity.ok(advisorService.getStudentsByAdvisorId(advisorId));
    }
}
