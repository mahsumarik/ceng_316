package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "student_lists")
@Getter
@Setter
public class StudentList extends Document {


    private String department; // Öğrencilerin ait olduğu bölüm

    private String faculty; // Öğrencilerin ait olduğu fakülte

    @ManyToOne
    @JoinColumn(name = "advisor_id")
    private Advisor advisor; // Danışman ile ilişki (Birebir ilişki)

    @ManyToOne
    @JoinColumn(name = "secretary_id")
    private Secretary secretary; // Sekreter ile ilişki (Many-to-One)

    @ManyToOne
    @JoinColumn(name = "dean_id")
    private Dean dean; // Dekan ile ilişki (Many-to-One)

    @ManyToOne
    @JoinColumn(name = "student_affair_id")
    private StudentAffair studentAffair;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "student_list_students",
            joinColumns = @JoinColumn(name = "student_list_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> students; // Öğrencilerin listesi

    private LocalDateTime creationDate; // Belgenin oluşturulma tarihi

}

