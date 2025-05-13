package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "advisors")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Advisor extends User {
    @OneToMany(mappedBy = "advisor")
    private List<Student> students;

    @OneToMany(mappedBy = "advisor")
    private List<StudentList> studentLists;

    @Column(nullable = true)
    private String faculty;

    @Column(nullable = true)
    private String department;
}
