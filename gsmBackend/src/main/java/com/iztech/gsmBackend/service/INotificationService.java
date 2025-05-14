package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.model.Notification;
import java.util.List;

public interface INotificationService {
    void sendStudentNotification(Long studentId, String name);
    void notifyStudentToUploadTranscript(Long studentId);
    void sendNotification(Long userId, String message);
    List<Notification> getNotificationsByUserId(Long userId);
    void deleteNotification(Long userId, int notificationIndex);
}
