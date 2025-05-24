import api from './api';

const StudentAffairService = {
  getFacultyStatuses: async () => {
    const response = await api.get('/api/studentAffair/faculty-statuses');
    return response.data;
  },

  notifyDean: async (deanId) => {
    const response = await api.post('/api/studentAffair/notify-dean', null, { params: { deanId } });
    return response.data;
  },

  getApprovedStudents: async (studentAffairId) => {
    const response = await api.get('/api/studentAffair/approved-students', { params: { studentAffairId } });
    return response.data;
  },

  prepareDiploma: async (studentId, studentAffairId) => {
    try {
      const response = await api.post(`/api/studentAffair/prepare-diploma/${studentId}`, null, {
        params: { studentAffairId },
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error('Diploma preparation error:', error);
      throw error;
    }
  },

  cancelDiploma: async (studentId) => {
    try {
      const response = await api.delete(`/api/studentAffair/cancel-diploma/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Diploma cancellation error:', error);
      throw error;
    }
  },

  downloadDiploma: async (studentId) => {
    try {
      const response = await api.get(`/api/studentAffair/diploma/${studentId}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error('Diploma download error:', error);
      throw error;
    }
  },

  viewDiploma: async (studentId) => {
    try {
      const response = await api.get(`/api/studentAffair/diploma/view/${studentId}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error('Diploma view error:', error);
      throw error;
    }
  },

  downloadStudentList: async (studentAffairId) => {
    try {
      const response = await api.get('/api/studentAffair/download-student-list', {
        params: { studentAffairId },
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error('Student list download error:', error);
      throw error;
    }
  },

  downloadAllDiplomas: async (studentAffairId) => {
    try {
      const response = await api.get('/api/studentAffair/download-all-diplomas', {
        params: { studentAffairId },
        responseType: 'blob',
        headers: {
          'Accept': 'application/zip'
        }
      });
      return response;
    } catch (error) {
      console.error('All diplomas download error:', error);
      throw error;
    }
  }
};

export default StudentAffairService; 