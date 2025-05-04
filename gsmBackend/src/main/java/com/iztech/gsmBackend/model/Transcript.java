package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transcripts")
@Getter
@Setter
public class Transcript extends Document {

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student; // Transcript ile ilişkilendirilen öğrenci

    private double gpa; // Öğrencinin GPA'sı
    private int ectsEarned; // Öğrencinin kazandığı ECTS
}