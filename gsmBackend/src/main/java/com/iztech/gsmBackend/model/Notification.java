package com.iztech.gsmBackend.model;

import java.time.LocalDateTime;

public class Notification {
    private Long userId;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public Notification(Long userId, String message, String status) {
        this.userId = userId;
        this.message = message;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "userId=" + userId +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
