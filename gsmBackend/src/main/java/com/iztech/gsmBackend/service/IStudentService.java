package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.dto.StudentRankingDto;
import com.iztech.gsmBackend.enums.ROLE;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Transcript;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IStudentService {

    void uploadTranscript(Long studentId, MultipartFile file) throws IOException;

    Transcript getTranscript(Long studentId);

    void deleteTranscript(Long studentId);

    StudentDto getStudentById(Long studentId);

    void updateStudentStatus(Long studentId, STATUS status, ROLE role);

    StudentRankingDto getStudentRanking(Long studentId);
}
