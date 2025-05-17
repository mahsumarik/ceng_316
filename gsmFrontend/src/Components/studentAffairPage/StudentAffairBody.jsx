import React, { useState, useEffect } from 'react';
import './StudentAffairBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';
import Pagination from '../Pagination/Pagination';
import StudentAffairService from '../../services/StudentAffairService';

const StudentAffairBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const data = await StudentAffairService.getFacultyStatuses();
                setFaculties(data);
            } catch (err) {
                console.error('Failed to fetch faculties:', err);
            }
        };
        const fetchStudents = async () => {
            try {
                const data = await StudentAffairService.getApprovedStudents(userId);
                setStudents(data);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            }
        };
        const loadNotifications = async () => {
            try {
                const notificationsData = await NotificationService.getNotifications(userId);
                setNotifications(notificationsData);
            } catch (err) {
                console.error("Failed to load notifications:", err);
            }
        };
        fetchFaculties();
        fetchStudents();
        loadNotifications();
    }, [userId]);

    const handleDeleteNotification = async (index) => {
        try {
            await NotificationService.deleteNotification(userId, index);
            const updatedNotifications = await NotificationService.getNotifications(userId);
            setNotifications(updatedNotifications);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const handleSendNotification = async (faculty) => {
        try {
            await StudentAffairService.notifyDean(faculty.facultyId);
            alert('Notification sent to dean!');
        } catch (err) {
            alert('Notification already sent or failed.');
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

    const handleDownloadAllDiplomas = () => {
        // This will be implemented later
        console.log('Downloading all diplomas');
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        (`${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber?.toString().includes(searchTerm))
    );

    if (showViewDetails && selectedStudent) {
        return (
            <div className="student-affairs-container">
                <aside className="student-sidebar">
                    <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                        Notifications
                        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                    </button>
                    <button className={activeTab === 'Faculties' ? 'active' : ''} onClick={() => setActiveTab('Faculties')}>
                        Faculties
                    </button>
                    <button className={activeTab === 'Student List' ? 'active' : ''} onClick={() => { setActiveTab('Student List'); handleBack(); }}>
                        Student List
                    </button>
                </aside>
                <div className="main-content">
                    <div className="view-details-header">
                        <button className="back-btn" onClick={handleBack}>
                            ← Back to Student List
                        </button>
                    </div>
                    <ViewDetails student={selectedStudent} />
                </div>
            </div>
        );
    }

    return (
        <div className="student-affairs-container">
            <aside className="student-sidebar">
                <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                    Notifications
                    {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                </button>
                <button className={activeTab === 'Faculties' ? 'active' : ''} onClick={() => setActiveTab('Faculties')}>
                    Faculties
                </button>
                <button className={activeTab === 'Student List' ? 'active' : ''} onClick={() => setActiveTab('Student List')}>
                    Student List
                </button>
            </aside>
            <div className="main-content">
                {activeTab === 'Faculties' ? (
                    <>
                        <div className="section-header">
                            <h2>Faculties</h2>
                        </div>
                        <div>
                            {faculties.map((faculty, index) => (
                                <div key={index} className="faculty-card">
                                    <div className="faculty-info">
                                        <div className="faculty-name">Name: {faculty.name}</div>
                                    </div>
                                    <div className="student-list-status">
                                        <span className={`status-text ${faculty.status === 'PENDING' ? 'status-pending' : 'status-sent'}`}>Student List: {faculty.status}</span>
                                        {faculty.status === 'PENDING' && (
                                            <button 
                                                className="send-notification-btn"
                                                onClick={() => handleSendNotification(faculty)}
                                            >
                                                Send Notification
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'Student List' ? (
                    <>
                        <div className="section-header">
                            <h2>Student List</h2>
                            <button 
                                className="download-all-btn"
                                onClick={handleDownloadAllDiplomas}
                            >
                                Download All Diplomas
                            </button>
                        </div>
                        <div className="search-section">
                            <label className="search-label">Search Student:</label>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter Student Name or ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                                                    <div className="student-details">Department: {student.department}</div>
                                                    <div className="student-details">Faculty: {student.faculty}</div>
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

export default StudentAffairBody;
