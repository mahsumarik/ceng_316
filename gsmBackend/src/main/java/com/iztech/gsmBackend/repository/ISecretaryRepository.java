package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Secretary;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.StudentList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ISecretaryRepository extends JpaRepository<Secretary,Long> {
    Optional<Secretary> findByEmail(String email) ;

    List<Secretary> findAll();

}
