package com.iztech.gsmBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.iztech.gsmBackend.repository")
@EntityScan(basePackages = "com.iztech.gsmBackend.model")
public class GsmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GsmBackendApplication.class, args);
	}

}
