package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "deans")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Dean extends User {
    @OneToMany(mappedBy = "dean")
    private List<StudentList> studentLists;

    private String faculty;
}
