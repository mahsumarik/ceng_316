import React, { useState, useRef, useEffect } from 'react';
import './StudentBody.css';
import { useAuth } from '../../context/AuthContext';
import StudentService from '../../services/StudentService';
import NotificationService from '../../services/NotificationService';


const DUMMY_TRANSCRIPT = null;

const StudentBody = () => {
  const { userId } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Graduation Details');
  const [transcript, setTranscript] = useState(DUMMY_TRANSCRIPT);
  const fileInputRef = useRef();
  const [studentData, setStudentData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!userId) return;
      try {
        const blob = await StudentService.downloadTranscript(userId);
        setTranscript({ url: window.URL.createObjectURL(blob) });
      } catch {
        setTranscript(null);
      }
    };
    fetchTranscript();
  }, [userId]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!userId) return;
      try {
        const data = await StudentService.getStudentDetails(userId);
        setStudentData(data);
        const rankingData = await StudentService.getStudentRanking(userId);
        setRanking(rankingData);
      } catch (err) {
        console.error("Student details fetch error", err);
      }
    };
    fetchStudentData();
  }, [userId]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await NotificationService.getNotifications(userId);
        setNotifications(notificationsData);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };
    loadNotifications();
  }, [userId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await StudentService.uploadTranscript(userId, file);
    setTranscript({ url: URL.createObjectURL(file) });
  };

  const handleDownload = async () => {
    const blob = await StudentService.downloadTranscript(userId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShowTranscript = async () => {
    if (!transcript) {
      const blob = await StudentService.downloadTranscript(userId);
      const url = window.URL.createObjectURL(blob);
      setTranscript({ url });
      window.open(url, "_blank");
    } else {
      window.open(transcript.url, "_blank");
    }
  };

  const handleRemoveTranscript = async () => {
    if (window.confirm("Are you sure you want to remove your transcript?")) {
      await StudentService.deleteTranscript(userId);
      setTranscript(null);
    }
  };

  const handleDeleteNotification = async (index) => {
    try {
      await NotificationService.deleteNotification(userId, index);
      const updated = await NotificationService.getNotifications(userId);
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getApprovalStatus = () => {
    if (!studentData) return [];
    return [
      {
        label: `Advisor: ${studentData.advisorDto?.firstName || '--'} ${studentData.advisorDto?.lastName || '--'}`,
        status: studentData.advisorStatus || 'PENDING',
        color:
          studentData.advisorStatus === 'APPROVED'
            ? 'green'
            : studentData.advisorStatus === 'REJECTED'
            ? 'red'
            : 'orange',
      },
      {
        label: 'Department Secretary',
        status: studentData.secretaryStatus || 'PENDING',
        color:
          studentData.secretaryStatus === 'APPROVED'
            ? 'green'
            : studentData.secretaryStatus === 'REJECTED'
            ? 'red'
            : 'orange',
      },
      {
        label: "Dean's Office",
        status: studentData.deanStatus || 'PENDING',
        color:
          studentData.deanStatus === 'APPROVED'
            ? 'green'
            : studentData.deanStatus === 'REJECTED'
            ? 'red'
            : 'orange',
      },
      {
        label: 'Student Affair',
        status: studentData.studentAffairStatus || 'PENDING',
        color:
          studentData.studentAffairStatus === 'APPROVED'
            ? 'green'
            : studentData.studentAffairStatus === 'REJECTED'
            ? 'red'
            : 'orange',
      },
      {
      label: 'Graduation Status',
      status: studentData.graduationStatus === true ? 'APPROVED' : 'PENDING',
      color: studentData.graduationStatus === true ? 'green' : 'orange',
      },
    ];
  };

  return (
    <div className="student-body-root">
      <aside className="student-sidebar">
        <button className={activeMenu === 'Notifications' ? 'active' : ''} onClick={() => setActiveMenu('Notifications')}>
          Notifications
          {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
        </button>
        <button className={activeMenu === 'Graduation Details' ? 'active' : ''} onClick={() => setActiveMenu('Graduation Details')}>
          Graduation Details
        </button>
      </aside>
      <main className="student-main">
        {activeMenu === 'Graduation Details' && (
          <div className="graduation-details">
            <h2>Graduation Details</h2>
            <div className="details-flex">
              <section className="approval-status">
                <h3>Approval Status</h3>
                <div className="approval-list">
                  {getApprovalStatus().map((item) => (
                    <div key={item.label} className="approval-item">
                      <span className="approval-label">{item.label}</span>
                      <span className={`approval-status-text ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="overall-status">
                <h3>Overall</h3>
                <div className="overall-list">
                  <div><b>GPA</b> <span>{studentData?.gpa ?? '--'}</span></div>
                  <div><b>ECTS</b> <span>{studentData?.ectsEarned ?? '--'}</span></div>
                  <div><b>Department Ranking</b> <span>{ranking ? `${ranking.departmentRank} / ${ranking.departmentTotal}` : '--'}</span></div>
                  <div><b>Faculty Ranking</b> <span>{ranking ? `${ranking.facultyRank} / ${ranking.facultyTotal}` : '--'}</span></div>
                  <div><b>University Ranking</b> <span>{ranking ? `${ranking.universityRank} / ${ranking.universityTotal}` : '--'}</span></div>
                </div>
              </section>
            </div>
            <section className="transcript-section">
              <h3>Transcript</h3>
              {!transcript ? (
                <div className="transcript-upload">
                  <input type="file" accept="application/pdf" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />
                  <button onClick={() => fileInputRef.current.click()}>Upload Transcript (PDF)</button>
                </div>
              ) : (
                <div className="transcript-actions">
                  <button onClick={handleShowTranscript}>View</button>
                  <button onClick={handleDownload}>Download</button>
                  <button className="remove-btn" onClick={handleRemoveTranscript}>Remove</button>
                </div>
              )}
            </section>
          </div>
        )}
        {activeMenu === 'Notifications' && (
          <div className="notifications-section">
            <h2>Notifications</h2>
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">No notifications to display.</div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <div className="notification-content">
                      <div className="notification-message">{notification.message}</div>
                    </div>
                    <button
                      className="delete-notification-btn"
                      onClick={() => handleDeleteNotification(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentBody;