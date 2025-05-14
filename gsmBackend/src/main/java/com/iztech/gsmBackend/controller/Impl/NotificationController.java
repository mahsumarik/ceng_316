package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.INotificationController;
import com.iztech.gsmBackend.model.Notification;
import com.iztech.gsmBackend.service.Impl.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController implements INotificationController {

    @Autowired
    private NotificationService notificationService;

    @Override
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestParam Long userId, @RequestParam String message) {
        notificationService.sendNotification(userId, message);
        return ResponseEntity.ok("Notification sent.");
    }

    @Override
    @PostMapping("/send/student/{studentId}/status/{status}")
    public ResponseEntity<String> sendStudentNotification(@PathVariable Long studentId, @PathVariable String status) {
        notificationService.sendStudentNotification(studentId, status);
        return ResponseEntity.ok("Student status notification sent.");
    }

    @Override
    @PostMapping("/send/transcript/{studentId}")
    public ResponseEntity<String> sendTranscriptNotification(@PathVariable Long studentId) {
        notificationService.notifyStudentToUploadTranscript(studentId);
        return ResponseEntity.ok("Transcript upload reminder sent.");
    }

    @Override
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @Override
    @DeleteMapping("/user/{userId}/notification/{index}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long userId, @PathVariable int index) {
        notificationService.deleteNotification(userId, index);
        return ResponseEntity.ok("Notification deleted successfully.");
    }
}
