package com.iztech.gsmBackend.repository;

import com.iztech.gsmBackend.model.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ITranscriptRepository extends JpaRepository<Transcript,Long > {

    Optional<Transcript> findByStudentId(Long studentId);

    boolean existsByStudentId(Long studentId);
}
