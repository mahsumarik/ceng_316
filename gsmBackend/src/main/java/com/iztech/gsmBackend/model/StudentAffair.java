package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "student_affairs")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudentAffair extends User {
    @OneToMany(mappedBy = "studentAffair")
    private List<Diploma> diplomas;
}
