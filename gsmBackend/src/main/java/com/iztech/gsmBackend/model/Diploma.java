package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "diplomas")
@Getter
@Setter
public class Diploma extends Document {

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student; // Diplomanın ilişkili olduğu öğrenci

    @ManyToOne
    @JoinColumn(name = "student_affair_id")
    private StudentAffair studentAffair; // Öğrenci işleri ile ilişki (Many-to-One)

    private boolean approved; // Diplomanın onay durumu

    private LocalDateTime creationDate; // Belgenin oluşturulma tarihi
}
