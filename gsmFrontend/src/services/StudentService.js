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
};

export default StudentService; 