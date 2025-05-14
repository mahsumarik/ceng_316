package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.model.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

public interface INotificationController {
    @PostMapping("/send")
    ResponseEntity<String> sendNotification(@RequestParam Long userId, @RequestParam String message);

    @PostMapping("/send/student/{studentId}/status/{status}")
    ResponseEntity<String> sendStudentNotification(@PathVariable Long studentId, @PathVariable String status);

    @PostMapping("/send/transcript/{studentId}")
    ResponseEntity<String> sendTranscriptNotification(@PathVariable Long studentId);

    @GetMapping("/user/{userId}")
    ResponseEntity<List<Notification>> getNotifications(@PathVariable Long userId);

    @DeleteMapping("/user/{userId}/notification/{index}")
    ResponseEntity<String> deleteNotification(@PathVariable Long userId, @PathVariable int index);
}
