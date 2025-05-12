package com.iztech.gsmBackend.model;

import com.iztech.gsmBackend.enums.STATUS;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @Lob
    private byte[] content; // Belgenin içeriği

}
