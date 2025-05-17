package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.StudentList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IStudentListRepository extends JpaRepository<StudentList, Long> {

    List<StudentList> findByAdvisorId(Long advisorId);
    List<StudentList> findBySecretaryId(Long secretaryId);
    List<StudentList> findByDeanId(Long deanId);
    List<StudentList> findByAdvisorIdAndSecretaryId(Long advisorId, Long secretaryId);
    List<StudentList> findBySecretaryIdAndDeanIdIsNotNull(Long secretaryId);

}