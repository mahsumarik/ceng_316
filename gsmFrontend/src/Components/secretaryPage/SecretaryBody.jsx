import React, { useState, useEffect } from 'react';
import './SecretaryBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';
import SecretaryService from '../../services/SecretaryService'; // Yeni eklendi

const SecretaryBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [advisorStatuses, setAdvisorStatuses] = useState([]);
    const [students, setStudents] = useState([]); // Backend'den gelecek onaylanmışlar
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const notificationsData = await NotificationService.getNotifications(userId);
                setNotifications(notificationsData);
            } catch (err) {
                console.error("Failed to load notifications:", err);
            }
        };

        const fetchAdvisorStatuses = async () => {
            try {
                const department = await SecretaryService.getDepartment(userId); // Sekreterin departmanı
                console.log(department)
                const statusData = await SecretaryService.getAdvisorStatuses(department);
                setAdvisorStatuses(statusData);
            } catch (err) {
                console.error("Failed to fetch advisor statuses:", err);
            }
        };

        const fetchApprovedStudents = async () => {
            try {
                const data = await SecretaryService.getApprovedStudents(userId);
                console.log("📦 Students fetched from backend:", data);
                if (Array.isArray(data)) {
                    setStudents(data);
                } else if (data && data.students) {
                    setStudents(data.students);
                } else {
                    console.error("Unexpected data format:", data);
                    setStudents([]);
                }
            } catch (err) {
                console.error("Failed to fetch students:", err);
                setStudents([]);
            }
        }

        loadNotifications();
        fetchAdvisorStatuses();
        fetchApprovedStudents();
    }, [userId]);

    const handleDeleteNotification = async (index) => {
        try {
            await NotificationService.deleteNotification(userId, index);
            const updated = await NotificationService.getNotifications(userId);
            setNotifications(updated);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const handleSendNotification = async (advisorId, advisorName) => {
        try {
            await SecretaryService.notifyAdvisor(advisorId);
            // Status'u değiştirme! Sadece bildirim gönder.
            // İstersen kullanıcıya "Notification sent" mesajı gösterebilirsin.
        } catch (err) {
            alert("Notification already sent or failed.");
        }
    };

    const handleViewDetails = (studentId) => {
        const student = students.find(s => s.id === studentId);
        setSelectedStudent(student);
        setShowViewDetails(true);
    };

    const handleBack = () => {
        setShowViewDetails(false);
        setSelectedStudent(null);
    };

    const handleSendToDean = async () => {
        try {
            await SecretaryService.sendApprovedStudentsToDean(userId);
            alert('Student list successfully sent to Dean!');
        } catch (error) {
            alert('Failed to send student list to Dean: ' + (error.response?.data || error.message));
        }
    };

    // Pagination calculations
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const filteredStudents = students.filter(student =>
        (`${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm))
    );
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    if (showViewDetails && selectedStudent) {
        return (
            <div className="secretary-container">
                <aside className="student-sidebar">
                    <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                        Notifications
                        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                    </button>
                    <button className={activeTab === 'Student List' ? 'active' : ''} onClick={() => { setActiveTab('Student List'); handleBack(); }}>
                        Student List
                    </button>
                    <button className={activeTab === 'Advisors' ? 'active' : ''} onClick={() => setActiveTab('Advisors')}>
                        Advisors
                    </button>
                </aside>
                <div className="main-content">
                    <div className="view-details-header">
                        <button className="back-btn" onClick={handleBack}> ← Back to Student List </button>
                    </div>
                    <ViewDetails student={selectedStudent} />
                </div>
            </div>
        );
    }

    return (
        <div className="secretary-container">
            <aside className="student-sidebar">
                <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                    Notifications
                    {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                </button>
                <button className={activeTab === 'Student List' ? 'active' : ''} onClick={() => setActiveTab('Student List')}>
                    Student List
                </button>
                <button className={activeTab === 'Advisors' ? 'active' : ''} onClick={() => setActiveTab('Advisors')}>
                    Advisors
                </button>
            </aside>
            <div className="main-content">
                {activeTab === 'Student List' ? (
                    <>
                        <div className="section-header">
                            <h2>Your Students</h2>
                            <button className="send-to-dean-btn" onClick={handleSendToDean}>Send Student List to Dean's Office</button>
                        </div>
                        <div className="search-section">
                            <label className="search-label">Search Student:</label>
                            <input type="text" className="search-input" placeholder="Enter Student Name or ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div>
                            {currentStudents && currentStudents.length > 0 ? (
                                currentStudents
                                    .map(student => (
                                        <div key={student.id} className="student-card">
                                            <div className="student-info">
                                                <div className="student-name">Student Name: {student.firstName} {student.lastName}</div>
                                                <div className="student-details">Student ID: {student.studentNumber}</div>
                                                <div className="student-details">GPA: {student.gpa}</div>
                                            </div>
                                            <button className="view-details-btn" onClick={() => handleViewDetails(student.id)}>View Details</button>
                                        </div>
                                    ))
                            ) : (
                                <div className="no-students">No students found.</div>
                            )}
                            {filteredStudents.length > studentsPerPage && (
                                <div className="pagination-controls">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1}>←</button>
                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        className={currentPage === pageNumber ? 'active' : ''}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                (pageNumber === currentPage - 2 && currentPage > 3) ||
                                                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                            ) {
                                                return <span key={pageNumber}>...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>→</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : activeTab === 'Advisors' ? (
                    <>
                        <div className="section-header">
                            <h2>Advisors</h2>
                        </div>
                        <div>
                            {advisorStatuses.map((advisor, index) => (
                                <div key={index} className="advisor-card">
                                    <div className="advisor-info">
                                        <div className="advisor-name">Name: {advisor.name}</div>
                                    </div>
                                    <div className="student-list-status">
                                        <span className={`status-text ${advisor.status === 'PENDING' ? 'status-pending' : 'status-sent'}`}>Student List: {advisor.status}</span>
                                        {advisor.status === 'PENDING' && (
                                            <button className="send-notification-btn" onClick={() => handleSendNotification(advisor.advisorId, advisor.name)}>Send Notification</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
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
            </div>
        </div>
    );
};

export default SecretaryBody;
