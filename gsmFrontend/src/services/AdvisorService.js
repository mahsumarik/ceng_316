import api from './api';

const AdvisorService = {
  getStudentsByAdvisorId: async (advisorId) => {
    const response = await api.get(`/advisors/${advisorId}/students`);
    return response.data;
  }
};

export default AdvisorService;
