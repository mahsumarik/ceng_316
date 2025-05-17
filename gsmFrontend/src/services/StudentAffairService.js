import api from './api';
import axios from 'axios';

const API_URL = '/api/studentAffair';

const StudentAffairService = {
  getFacultyStatuses: async () => {
    const response = await api.get('/studentAffair/faculty-statuses');
    return response.data;
  },

  notifyDean: async (deanId) => {
    const response = await api.post('/studentAffair/notify-dean', null, { params: { deanId } });
    return response.data;
  },

  getApprovedStudents: async (studentAffairId) => {
    const response = await api.get('/studentAffair/approved-students', { params: { studentAffairId } });
    return response.data;
  },

  prepareDiploma: (studentId, studentAffairId) =>
    axios.post(`${API_URL}/prepare-diploma/${studentId}?studentAffairId=${studentAffairId}`, null, { responseType: 'blob' }),

  cancelDiploma: (studentId) =>
    axios.delete(`${API_URL}/cancel-diploma/${studentId}`),

  downloadDiploma: (studentId) =>
    axios.get(`${API_URL}/diploma/${studentId}`, { responseType: 'blob' }),

  viewDiploma: (studentId) =>
    axios.get(`${API_URL}/diploma/view/${studentId}`, { responseType: 'blob' }),

  downloadStudentList: (studentAffairId) =>
    axios.get(`${API_URL}/download-student-list?studentAffairId=${studentAffairId}`, { responseType: 'blob' }),

  downloadAllDiplomas: (studentAffairId) =>
    axios.get(`${API_URL}/download-all-diplomas?studentAffairId=${studentAffairId}`, { responseType: 'blob' }),
};

export default StudentAffairService; 