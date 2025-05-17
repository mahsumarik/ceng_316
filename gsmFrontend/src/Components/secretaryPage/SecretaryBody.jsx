import React, { useState, useEffect } from 'react';
import './SecretaryBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';
import SecretaryService from '../../services/SecretaryService';
import Pagination from '../Pagination/Pagination';

const SecretaryBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [advisorStatuses, setAdvisorStatuses] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchAdvisorStatuses = async () => {
            try {
                const department = await SecretaryService.getDepartment(userId);
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

        const loadNotifications = async () => {
            try {
                const notificationsData = await NotificationService.getNotifications(userId);
                setNotifications(notificationsData);
            } catch (err) {
                console.error("Failed to load notifications:", err);
            }
        };

        fetchAdvisorStatuses();
        fetchApprovedStudents();
        loadNotifications();
    }, [userId]);

    const handleSendNotification = async (advisorId) => {
        try {
            await SecretaryService.notifyAdvisor(advisorId);
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
            console.log("Sending approved students to Dean, secretaryId:", userId);
            await SecretaryService.sendApprovedStudentsToDean(userId);
            alert('Student list successfully sent to Dean!');
        } catch (error) {
            alert('Failed to send student list to Dean: ' + (error.response?.data || error.message));
        }
    };

    const handleDeleteNotification = async (index) => {
        try {
            await NotificationService.deleteNotification(userId, index);
            const updatedNotifications = await NotificationService.getNotifications(userId);
            setNotifications(updatedNotifications);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const filteredStudents = students.filter(student =>
        (`${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm))
    );

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
                            <Pagination
                                filteredItems={filteredStudents}
                                itemsPerPage={5}
                            >
                                {(currentStudents) => (
                                    currentStudents && currentStudents.length > 0 ? (
                                        currentStudents.map(student => (
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
                                    )
                                )}
                            </Pagination>
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
