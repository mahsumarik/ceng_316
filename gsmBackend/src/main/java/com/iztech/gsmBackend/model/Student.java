package com.iztech.gsmBackend.model;

import com.iztech.gsmBackend.enums.STATUS;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "students")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Student extends User {
    private String studentNumber;

    private String department;

    private String faculty;

    private LocalDate enrollmentDate;

    private Boolean graduationStatus;

    private Double gpa;

    private int ectsEarned;

    @ManyToOne
    @JoinColumn(name = "advisor_id")
    private Advisor advisor;
    
    @OneToOne(mappedBy = "student")
    private Transcript transcript;
    
    @OneToOne(mappedBy = "student")
    private Diploma diploma;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(10)")
    private STATUS advisorStatus = STATUS.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(10)")
    private STATUS secretaryStatus = STATUS.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(10)")
    private STATUS deanStatus = STATUS.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(10)")
    private STATUS studentAffairStatus = STATUS.PENDING;
}
