import api from './api';

const SecretaryService = {
  getAdvisorStatuses: async (department) => {
    const response = await api.get('/secretary/advisor-statuses', {
      params: { department }
    });
    return response.data;
  },

  notifyAdvisor: async (advisorId) => {
    const response = await api.post('/secretary/notify-advisor', null, {
      params: { advisorId }
    });
    return response.data;
  },

  getApprovedStudents: async (secretaryId) => {
    const response = await api.get('/secretary/approved-students', {
      params: { secretaryId }
    });
    console.log(response.data)
    return response.data;
  },

  getDepartment: async (secretaryId) => {
  const response = await api.get('/secretary/department', {
    params: { secretaryId }
  });
  return response.data;
},
};

export default SecretaryService;
