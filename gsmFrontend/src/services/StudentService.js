import api from './api';

const StudentService = {
  // Transcript yükleme
  uploadTranscript: (studentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/${studentId}/upload-transcript`, formData);
  },

  // Transcript indirme (PDF olarak)
  downloadTranscript: async (studentId) => {
    const response = await api.get(`/students/${studentId}/transcript`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteTranscript: (studentId) => {
    return api.delete(`/students/${studentId}/transcript`);
  },

  getStudentDetails: async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
  },

  // StudentService.js
  updateStatus: (studentId, newStatus) => {
    if (newStatus === "APPROVED") {
      return api.put(`/students/${studentId}/approve`);
    } else if (newStatus === "REJECTED") {
      return api.put(`/students/${studentId}/reject`);
    } else if (newStatus === "PENDING") {
      return api.put(`/students/${studentId}/pending`);
    } else {
      console.error("‼️ Unknown status sent:", newStatus);
    }
  }


};

export default StudentService; 