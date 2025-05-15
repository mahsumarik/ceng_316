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
    try {
      const response = await api.get('/secretary/approved-students', {
        params: { secretaryId }
      });
      console.log("Raw response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching approved students:", error);
      throw error;
    }
  },

  getDepartment: async (secretaryId) => {
  const response = await api.get('/secretary/department', {
    params: { secretaryId }
  });
  return response.data;
},
};

export default SecretaryService;
