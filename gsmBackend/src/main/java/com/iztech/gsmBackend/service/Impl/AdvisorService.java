package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.model.Advisor;
import com.iztech.gsmBackend.repository.IAdvisorRepository;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.service.IAdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdvisorService implements IAdvisorService {

    @Autowired
    private IStudentRepository studentRepository;

    @Override
    public List<StudentDto> getStudentsByAdvisorId(Long advisorId) {
        return studentRepository.findByAdvisorId(advisorId).stream().map(student -> {
            StudentDto dto = new StudentDto();
            dto.setId(student.getId());
            dto.setFirstName(student.getFirstName());
            dto.setLastName(student.getLastName());
            dto.setGpa(student.getGpa());
            dto.setDepartment(student.getDepartment());
            dto.setFaculty(student.getFaculty());
            dto.setStudentNumber(student.getStudentNumber());
            dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
            dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
            dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
            dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
            dto.setEctsEarned(student.getEctsEarned());
            return dto;
        }).collect(Collectors.toList());
    }
}

