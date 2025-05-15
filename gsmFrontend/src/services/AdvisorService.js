import api from './api';

const AdvisorService = {
  getStudentsByAdvisorId: async (advisorId) => {
    const response = await api.get(`/advisors/${advisorId}/students`);
    return response.data;
  },

  sendApprovedStudentsToSecretary: async (advisorId) => {
    await api.post(`/advisors/${advisorId}/send-to-secretary`);
  }
};

export default AdvisorService;
