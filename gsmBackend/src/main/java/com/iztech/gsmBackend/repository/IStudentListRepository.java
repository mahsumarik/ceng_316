package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.StudentList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IStudentListRepository extends JpaRepository<StudentList, Long> {

    List<StudentList> findByAdvisorId(Long advisorId);
    List<StudentList> findBySecretaryId(Long secretaryId);
    List<StudentList> findByAdvisorIdAndSecretaryId(Long id, Long id1);
}