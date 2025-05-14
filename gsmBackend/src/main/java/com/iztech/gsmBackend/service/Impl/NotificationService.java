package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.model.Notification;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService implements INotificationService {

    // Kullanıcı ID'sine göre notification'ları tutan map
    private final Map<Long, List<Notification>> userNotifications = new ConcurrentHashMap<>();

    @Override
    public void sendNotification(Long userId, String message) {
        // Aynı mesajı içeren bir notification zaten varsa tekrar ekleme
        List<Notification> existing = userNotifications.getOrDefault(userId, new ArrayList<>());
        boolean alreadyExists = existing.stream().anyMatch(n -> n.getMessage().equals(message));
        if (alreadyExists) {
            return;
        }
        Notification notification = new Notification(userId, message, "UNREAD");
        userNotifications.computeIfAbsent(userId, k -> new ArrayList<>()).add(notification);
    }

    @Override
    public void sendStudentNotification(Long studentId, String status) {
        String message = "";
        switch (status) {
            case "APPROVED":
                message = "Your graduation status has been approved by your advisor.";
                break;
            case "REJECTED":
                message = "Your graduation status has been rejected by your advisor.";
                break;
            case "PENDING":
                message = "Your graduation status is pending review by your advisor.";
                break;
            default:
                message = "Status is unknown.";
        }
        sendNotification(studentId, message);
    }

    @Override
    public void notifyStudentToUploadTranscript(Long studentId) {
        String message = "Your transcript has not been uploaded yet. Please upload it as soon as possible.";
        sendNotification(studentId, message);
    }

    @Override
    public List<Notification> getNotificationsByUserId(Long userId) {
        return userNotifications.getOrDefault(userId, new ArrayList<>());
    }

    @Override
    public void deleteNotification(Long userId, int notificationIndex) {
        List<Notification> notifications = userNotifications.get(userId);
        if (notifications != null && notificationIndex >= 0 && notificationIndex < notifications.size()) {
            notifications.remove(notificationIndex);
        }
    }
}
