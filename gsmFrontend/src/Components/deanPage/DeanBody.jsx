import React, { useState, useEffect } from 'react';
import './DeanBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';

const DeanBody = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);

    // Mock data for departments
    const departments = [
        {
            name: 'Computer Engineering',
            studentListStatus: 'Pending'
        },
        {
            name: 'Bio Engineering',
            studentListStatus: 'Sent'
        },
        {
            name: 'Environment Engineering',
            studentListStatus: 'Pending'
        },
        {
            name: 'Electric and Electronic Engineering',
            studentListStatus: 'Pending'
        },
        {
            name: 'Energy Systems',
            studentListStatus: 'Sent'
        }
    ];

    // Mock data for students (same as secretary page)
    const students = [
        {
            id: '1001',
            name: 'Alice Johnson',
            status: 'Approved',
            gpa: '3.95',
            ectsEarned: '240'
        },
        {
            id: '1002',
            name: 'Bob Smith',
            status: 'Approved',
            gpa: '3.65',
            ectsEarned: '240'
        }
    ];

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

    const handleDeleteNotification = async (index) => {
        try {
            await NotificationService.deleteNotification(userId, index);
            const updatedNotifications = await NotificationService.getNotifications(userId);
            setNotifications(updatedNotifications);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const handleSendNotification = (departmentName) => {
        // This will be implemented later
        console.log('Sending notification to department:', departmentName);
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

    if (showViewDetails && selectedStudent) {
        return (
            <div className="dean-container">
                <div className="sidebar">
                    <div 
                        className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Notifications')}
                    >
                        Notifications
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'Your Students' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('Your Students');
                            handleBack();
                        }}
                    >
                        Your Students
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'Departments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Departments')}
                    >
                        Departments
                    </div>
                </div>
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
        <div className="dean-container">
            <div className="sidebar">
                <div 
                    className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Notifications')}
                >
                    Notifications
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Your Students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Your Students')}
                >
                    Your Students
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Departments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Departments')}
                >
                    Departments
                </div>
            </div>

            <div className="main-content">
                {activeTab === 'Departments' ? (
                    <>
                        <div className="section-header">
                            <h2>Departments</h2>
                        </div>
                        <div>
                            {departments.map((department, index) => (
                                <div key={index} className="department-card">
                                    <div className="department-info">
                                        <div className="department-name">{department.name}</div>
                                    </div>
                                    <div className="status-container">
                                        <div className={`status-text ${
                                            department.studentListStatus === 'Pending' ? 'status-pending' : 'status-sent'
                                        }`}>
                                            Student List: {department.studentListStatus}
                                        </div>
                                        {department.studentListStatus === 'Pending' && (
                                            <button 
                                                className="send-notification-btn"
                                                onClick={() => handleSendNotification(department.name)}
                                            >
                                                Send Notification
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'Your Students' ? (
                    <>
                        <div className="section-header">
                            <h2>Your Students</h2>
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
                            {students
                                .filter(student => 
                                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    student.id.includes(searchTerm)
                                )
                                .map(student => (
                                    <div key={student.id} className="student-card">
                                        <div className="student-info">
                                            <div className="student-name">Student Name: {student.name}</div>
                                            <div className="student-details">Student ID: {student.id}</div>
                                            <div className="student-details">
                                                Status: <span className="status-approved">{student.status}</span>
                                            </div>
                                            <div className="student-details">GPA: {student.gpa}</div>
                                        </div>
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(student.id)}
                                        >
                                            View Details
                                        </button>
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

export default DeanBody;
