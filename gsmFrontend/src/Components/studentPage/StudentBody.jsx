import React, { useState, useRef } from 'react';
import './StudentBody.css';
import { useAuth } from '../../context/AuthContext'; // AuthContext'ten kullanıcı bilgilerini alıyoruz
import StudentService from '../../services/StudentService';

const DUMMY_APPROVAL = [
  { label: 'Advisor', status: 'Approved', color: 'green' },
  { label: 'Department Secretary', status: 'Pending', color: 'orange' },
  { label: "Dean's Office", status: 'Pending', color: 'orange' },
  { label: 'Student Affair', status: 'Pending', color: 'orange' },
];
const DUMMY_OVERALL = {
  gpa: 3.75,
  department: '--',
  faculty: '--',
  university: '--',
};
const DUMMY_TRANSCRIPT = null; // null ise yükleme, obje ise görüntüleme/indirme

const StudentBody = () => {
  const { user } = useAuth(); // AuthContext'ten kullanıcı bilgilerini alıyoruz
  const [activeMenu, setActiveMenu] = useState('Graduation Details');
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState(DUMMY_TRANSCRIPT); // null veya {url:...}
  const fileInputRef = useRef();

  // Kullanıcı bilgisi kontrolü (id alıyoruz)
  if (!user) {
    return <div>Öğrenci bilgileri yüklenemedi. Lütfen tekrar giriş yapın.</div>;
  }

  const studentId = user.sub; // user'ın içindeki sub veya başka bir alan, öğrenci kimliğini taşıyor olabilir.

  // Transcript yükleme
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await StudentService.uploadTranscript(studentId, file); // studentId'yi kullanarak gönderiyoruz
    setTranscript({ url: URL.createObjectURL(file) });
  };

  // Transcript indirme
  const handleDownload = async () => {
    const blob = await StudentService.downloadTranscript(studentId); // studentId'yi kullanarak indirme işlemi yapıyoruz
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Transcript görüntüleme
  const handleShowTranscript = async () => {
    if (!transcript) {
      // API'den çek
      const blob = await StudentService.downloadTranscript(studentId);
      setTranscript({ url: window.URL.createObjectURL(blob) });
    }
    setShowTranscript(true);
  };

  return (
    <div className="student-body-root">
      <aside className="student-sidebar">
        <button className={activeMenu === 'Notifications' ? 'active' : ''} onClick={() => setActiveMenu('Notifications')}>Notifications</button>
        <button className={activeMenu === 'Graduation Details' ? 'active' : ''} onClick={() => setActiveMenu('Graduation Details')}>Graduation Details</button>
      </aside>
      <main className="student-main">
        {activeMenu === 'Graduation Details' && (
          <div className="graduation-details">
            <h2>Graduation Details</h2>
            <div className="details-flex">
              <section className="approval-status">
                <h3>Approval Status</h3>
                <div className="approval-list">
                  {DUMMY_APPROVAL.map((item) => (
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
                  <div><b>GPA</b> <span>{DUMMY_OVERALL.gpa}</span></div>
                  <div><b>Department Rating</b> <span>{DUMMY_OVERALL.department}</span></div>
                  <div><b>Faculty Rating</b> <span>{DUMMY_OVERALL.faculty}</span></div>
                  <div><b>University Rating</b> <span>{DUMMY_OVERALL.university}</span></div>
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
                  <button onClick={handleShowTranscript}>Görüntüle</button>
                  <button onClick={handleDownload}>İndir</button>
                </div>
              )}
              {showTranscript && transcript && (
                <div className="transcript-modal">
                  <div className="modal-content">
                    <button className="close-btn" onClick={() => setShowTranscript(false)}>Kapat</button>
                    <iframe src={transcript.url} title="Transcript PDF" width="100%" height="500px" />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
        {activeMenu === 'Notifications' && (
          <div className="notifications-placeholder">No notifications yet.</div>
        )}
      </main>
    </div>
  );
};

export default StudentBody;
