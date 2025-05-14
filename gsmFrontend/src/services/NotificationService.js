import api from './api';

const NotificationService = {
  // Bildirim gönderme fonksiyonu
  sendNotification: async (userId, message) => {
    try {
      await api.post('/notifications/send', null, {
        params: {
          userId,
          message
        }
      });
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  },

  // Öğrencinin durum güncellemesi bildirimi
  sendStudentNotification: async (studentId, status) => {
    try {
      await api.post(`/notifications/send/student/${studentId}/status/${status}`);
      console.log("Student status notification sent.");
    } catch (error) {
      console.error("Error sending student notification:", error);
    }
  },

  // Transkript hatırlatması
  sendTranscriptNotification: async (studentId) => {
    try {
      await api.post(`/notifications/send/transcript/${studentId}`);
      console.log("Transcript upload reminder sent.");
    } catch (error) {
      console.error("Error sending transcript notification:", error);
    }
  },

  // Bildirimleri getir
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Bildirimi sil
  deleteNotification: async (userId, index) => {
    try {
      await api.delete(`/notifications/user/${userId}/notification/${index}`);
      console.log("Notification deleted successfully.");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
};

export default NotificationService;
