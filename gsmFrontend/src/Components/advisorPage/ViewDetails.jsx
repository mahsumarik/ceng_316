// ViewDetails.jsx
import React, { useEffect, useState } from 'react';
import StudentService from '../../services/StudentService';
import { useAuth } from '../../context/AuthContext';
import './ViewDetails.css';

const ViewDetails = ({ student, setSelectedStudent, onStatusChange }) => {
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const blob = await StudentService.downloadTranscript(student.id);
        const url = window.URL.createObjectURL(blob);
        setTranscriptUrl(url);
      } catch (err) {
        setTranscriptUrl(null);
      }
    };

    if (student?.id) fetchTranscript();
  }, [student]);

  const handleStatusUpdate = async (status) => {
    try {
      if (!user || !user.role) return;

      await StudentService.updateStatus(student.id, status, user.role);

      const updatedStudent = { ...student, advisorStatus: status };
      setStatusMessage(`Student has been ${status.toLowerCase()} by ${user.role.toLowerCase()}.`);
      setSelectedStudent(updatedStudent);
      student.advisorStatus=status

      if (onStatusChange) onStatusChange(updatedStudent);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleView = () => {
    if (transcriptUrl) window.open(transcriptUrl, '_blank');
  };

  const handleDownload = () => {
    if (transcriptUrl) {
      const a = document.createElement('a');
      a.href = transcriptUrl;
      a.download = 'transcript.pdf';
      a.click();
      window.URL.revokeObjectURL(transcriptUrl);
    }
  };

  return (
    <div className="details-container">
      <div className="graduation-details-box">
        <h2>Graduation Details</h2>
        <div className="student-info-grid">
          <div className="info-group"><label>Student Name</label><div className="info-value">{student.firstName} {student.lastName}</div></div>
          <div className="info-group"><label>Student ID</label><div className="info-value">{student.studentNumber}</div></div>
          <div className="info-group"><label>ECTS Earned</label><div className="info-value">{student.ectsEarned}</div></div>
          <div className="info-group"><label>GPA</label><div className="info-value">{student.gpa}</div></div>
        </div>

        <div className="action-buttons">
          <button className={`approve-btn ${student.advisorStatus === 'APPROVED' ? 'disabled' : ''}`} onClick={() => handleStatusUpdate('APPROVED')} disabled={student.advisorStatus === 'APPROVED'}>Approve</button>
          <button className={`reject-btn ${student.advisorStatus === 'REJECTED' ? 'disabled' : ''}`} onClick={() => handleStatusUpdate('REJECTED')} disabled={student.advisorStatus === 'REJECTED'}>Reject</button>
          <button className={`pending-btn ${student.advisorStatus === 'PENDING' ? 'disabled' : ''}`} onClick={() => handleStatusUpdate('PENDING')} disabled={student.advisorStatus === 'PENDING'}>Pending</button>
        </div>

        {statusMessage && <div className="status-message">{statusMessage}</div>}
      </div>

      <div className="transcript-box">
        <h2>Transcript</h2>
        {transcriptUrl ? (
          <div className="transcript-actions">
            <button className="view-btn" onClick={handleView}>View</button>
            <button className="download-btn" onClick={handleDownload}>Download</button>
          </div>
        ) : (
          <div className="no-transcript-msg">Transcript has not been uploaded by the student.</div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
