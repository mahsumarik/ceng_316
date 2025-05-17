import api from './api';

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
};

export default StudentAffairService; 