package com.iztech.gsmBackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.iztech.gsmBackend.dto.AdvisorStatusDto;

public interface ISecretaryController {


    ResponseEntity<List<AdvisorStatusDto>> getAdvisorStatuses(@RequestParam String department);


    ResponseEntity<String> notifyAdvisor(@RequestParam Long advisorId);


    ResponseEntity<?> getApprovedStudents(@RequestParam Long secretaryId);


    ResponseEntity<String> getDepartment(@RequestParam Long secretaryId);


    ResponseEntity<String> sendStudentListToDean(@RequestParam Long secretaryId);
}
