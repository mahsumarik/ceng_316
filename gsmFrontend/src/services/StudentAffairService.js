import api from './api';

// All endpoints in this service are relative to the backend baseURL that is
// already set in api.js (e.g., https://ceng316-production.up.railway.app/api).
// We therefore only append the path segment for the Student Affair module.
const API_PREFIX = '/studentAffair';

const StudentAffairService = {
  // ────────────────────────────────────────────────────────────────────────────
  // READ OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  /** Get SENT / PENDING status of each faculty */
  getFacultyStatuses: async () => {
    const { data } = await api.get(`${API_PREFIX}/faculty-statuses`);
    return data;
  },

  /** Notify dean of a specific faculty */
  notifyDean: async (deanId) => {
    const { data } = await api.post(`${API_PREFIX}/notify-dean`, null, {
      params: { deanId },
    });
    return data;
  },

  /** List approved students visible to the Student Affairs user */
  getApprovedStudents: async (studentAffairId) => {
    const { data } = await api.get(`${API_PREFIX}/approved-students`, {
      params: { studentAffairId },
    });
    return data;
  },

  // ────────────────────────────────────────────────────────────────────────────
  // DIPLOMA OPERATIONS
  // ────────────────────────────────────────────────────────────────────────────
  /** Generate a diploma PDF for a student */
  prepareDiploma: (studentId, studentAffairId) =>
    api.post(
      `${API_PREFIX}/prepare-diploma/${studentId}`,
      null,
      {
        params: { studentAffairId },
        responseType: 'blob', // binary PDF
      }
    ),

  /** Cancel a previously-generated diploma */
  cancelDiploma: (studentId) =>
    api.delete(`${API_PREFIX}/cancel-diploma/${studentId}`),

  /** Download diploma PDF */
  downloadDiploma: (studentId) =>
    api.get(`${API_PREFIX}/diploma/${studentId}`, { responseType: 'blob' }),

  /** View diploma PDF inline (same endpoint, different usage) */
  viewDiploma: (studentId) =>
    api.get(`${API_PREFIX}/diploma/view/${studentId}`, { responseType: 'blob' }),

  // ────────────────────────────────────────────────────────────────────────────
  // BULK / LIST DOWNLOADS
  // ────────────────────────────────────────────────────────────────────────────
  /** Download the full student list PDF */
  downloadStudentList: (studentAffairId) =>
    api.get(`${API_PREFIX}/download-student-list`, {
      params: { studentAffairId },
      responseType: 'blob',
    }),

  /** Download a ZIP archive containing all diplomas */
  downloadAllDiplomas: (studentAffairId) =>
    api.get(`${API_PREFIX}/download-all-diplomas`, {
      params: { studentAffairId },
      responseType: 'blob',
    }),
};

export default StudentAffairService;
