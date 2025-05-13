import React from 'react';
import './ViewDetails.css';

const ViewDetails = ({ student }) => {
  return (
    <div className="details-container">
      <div className="graduation-details-box">
        <h2>Graduation Details</h2>
        
        <div className="student-info-grid">
          <div className="info-group">
            <label>Student Name</label>
            <div className="info-value">{student?.name || 'John Doe'}</div>
          </div>
          
          <div className="info-group">
            <label>Student ID</label>
            <div className="info-value">{student?.id || '12345678'}</div>
          </div>
          
          <div className="info-group">
            <label>ECTS Earned</label>
            <div className="info-value">{student?.ectsEarned || '240'}</div>
          </div>

          <div className="info-group">
            <label>GPA</label>
            <div className="info-value">{student?.gpa || '3.75'}</div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="approve-btn">Approve</button>
          <button className="reject-btn">Reject</button>
        </div>
      </div>

      <div className="transcript-box">
        <h2>Transcript</h2>
        <div className="transcript-actions">
          <button className="view-btn">View</button>
          <button className="download-btn">Download</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
