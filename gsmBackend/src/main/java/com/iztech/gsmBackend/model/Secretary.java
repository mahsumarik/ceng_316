package com.iztech.gsmBackend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "secretaries")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Secretary extends User {
    private String department;
    
    @OneToMany(mappedBy = "secretary")
    private List<StudentList> studentLists;
}
