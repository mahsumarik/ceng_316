import React, { useEffect, useState } from 'react';
import './ViewDetails.css';
import StudentService from '../../services/StudentService';


const ViewDetails = ({ student }) => {
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const blob = await StudentService.downloadTranscript(student.id);
        const url = window.URL.createObjectURL(blob);
        setTranscriptUrl(url);
      } catch (err) {
        setTranscriptUrl(null); // Transcript yoksa
      }
    };

    if (student?.id) fetchTranscript();
  }, [student]);

  const handleStatusUpdate = async (status) => {
  console.log("🔁 Trying to update status:", status);
  try {
    await StudentService.updateStatus(student.id, status);
    console.log("✅ API success");
    setStatusMessage(`Student has been ${status.toLowerCase()}.`);
    student.status = status;
  } catch (err) {
    console.error("❌ Failed to update status:", err);
  }
};


  const handleView = () => {
    if (transcriptUrl) {
      window.open(transcriptUrl, '_blank');
    }
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
          <div className="info-group">
            <label>Student Name</label>
            <div className="info-value">{student.firstName} {student.lastName}</div>
          </div>
          <div className="info-group">
            <label>Student ID</label>
            <div className="info-value">{student.studentNumber}</div>
          </div>
          <div className="info-group">
            <label>ECTS Earned</label>
            <div className="info-value">{student.ectsEarned}</div>
          </div>
          <div className="info-group">
            <label>GPA</label>
            <div className="info-value">{student.gpa}</div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className={`approve-btn ${student.status === 'APPROVED' ? 'disabled' : ''}`}
            onClick={() => handleStatusUpdate('APPROVED')}
            disabled={student.status === 'APPROVED'}
          >
            Approve
          </button>
          <button 
            className={`reject-btn ${student.status === 'REJECTED' ? 'disabled' : ''}`}
            onClick={() => handleStatusUpdate('REJECTED')}
            disabled={student.status === 'REJECTED'}
          >
            Reject
          </button>
          <button 
            className={`pending-btn ${student.status === 'PENDING' ? 'disabled' : ''}`}
            onClick={() => handleStatusUpdate('PENDING')}
            disabled={student.status === 'PENDING'}
          >
            Pending
          </button>
        </div>

        {statusMessage && (
          <div className="status-message">{statusMessage}</div>
        )}
      </div>

      <div className="transcript-box">
        <h2>Transcript</h2>
        {transcriptUrl ? (
          <div className="transcript-actions">
            <button className="view-btn" onClick={handleView}>View</button>
            <button className="download-btn" onClick={handleDownload}>Download</button>
          </div>
        ) : (
          <div className="no-transcript-msg">
            Transcript has not been uploaded by the student.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
