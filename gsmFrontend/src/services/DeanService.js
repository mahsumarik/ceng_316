import api from './api';

const DeanService = {
  getFaculty: async (deanId) => {
    const response = await api.get('/dean/faculty', { params: { deanId } });
    return response.data;
  },

  getDepartmentStatusesByFaculty: async (faculty) => {
    const response = await api.get('/dean/department-statuses', { params: { faculty } });
    return response.data;
  },

  notifySecretary: async (secretaryId) => {
    const response = await api.post('/dean/notify-secretary', null, { params: { secretaryId } });
    return response.data;
  },

  getApprovedStudents: async (deanId) => {
    const response = await api.get('/dean/approved-students', { params: { deanId } });
    return response.data;
  },

  sendApprovedStudentsToStudentAffair: async (deanId) => {
    const response = await api.post('/dean/send-to-student-affair', null, { params: { deanId } });
    return response.data;
  },
};

export default DeanService;