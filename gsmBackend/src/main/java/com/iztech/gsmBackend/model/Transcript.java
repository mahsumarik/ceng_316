package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transcripts")
@Getter
@Setter
public class Transcript extends Document {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student; // Transcript ile ilişkilendirilen öğrenci

}