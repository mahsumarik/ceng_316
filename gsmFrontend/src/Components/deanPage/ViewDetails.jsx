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
            <div className="info-value">{student?.firstName} {student?.lastName}</div>
          </div>
          
          <div className="info-group">
            <label>Student ID</label>
            <div className="info-value">{student?.studentNumber}</div>
          </div>
          
          <div className="info-group">
            <label>ECTS Earned</label>
            <div className="info-value">{student?.ectsEarned}</div>
          </div>

          <div className="info-group">
            <label>GPA</label>
            <div className="info-value">{student?.gpa}</div>
          </div>

          <div className="info-group">
            <label>Department</label>
            <div className="info-value">{student?.department}</div>
          </div>

          <div className="info-group">
            <label>Faculty</label>
            <div className="info-value">{student?.faculty}</div>
          </div>

          <div className="info-group">
            <label>Advisor Status</label>
            <div className="info-value">{student?.advisorStatus}</div>
          </div>

          <div className="info-group">
            <label>Secretary Status</label>
            <div className="info-value">{student?.secretaryStatus}</div>
          </div>

          <div className="info-group">
            <label>Dean Status</label>
            <div className="info-value">{student?.deanStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
