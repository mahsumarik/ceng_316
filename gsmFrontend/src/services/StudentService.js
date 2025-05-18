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
  updateStatus: (studentId, newStatus, role) => {
  return api.put(`/students/${studentId}/status`, null, {
    params: {
      status: newStatus,
      role: role,
    },
  });
},

getStudentRanking: async (studentId) => {
  const response = await api.get(`/students/ranking/${studentId}`);
  return response.data;
}

};

export default StudentService; 