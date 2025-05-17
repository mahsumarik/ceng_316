import React, { useState, useEffect } from 'react';
import './DeanBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';
import DeanService from '../../services/DeanService';
import Pagination from '../Pagination/Pagination';

const DeanBody = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [departmentStatuses, setDepartmentStatuses] = useState([]);
    const [approvedStudents, setApprovedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDeanData = async () => {
            try {
                const facultyData = await DeanService.getFaculty(userId);
                const deptStatuses = await DeanService.getDepartmentStatusesByFaculty(facultyData);
                setDepartmentStatuses(deptStatuses);
                const students = await DeanService.getApprovedStudents(userId);
                console.log(students)
                setApprovedStudents(students);
            } catch (err) {
                console.error('Dean data fetch error', err);
            }
        };
        const loadNotifications = async () => {
            try {
                const notificationsData = await NotificationService.getNotifications(userId);
                setNotifications(notificationsData);
            } catch (err) {
                console.error('Failed to load notifications:', err);
            }
        };
        fetchDeanData();
        loadNotifications();
    }, [userId]);

    const handleSendNotification = async (secretaryId) => {
        try {
            await DeanService.notifySecretary(secretaryId);
            alert('Notification sent to secretary!');
        } catch (err) {
            alert('Notification already sent or failed.');
        }
    };

    const handleViewDetails = (studentId) => {
        const student = approvedStudents.find(s => s.id === studentId);
        setSelectedStudent(student);
        setShowViewDetails(true);
    };

    const handleBack = () => {
        setShowViewDetails(false);
        setSelectedStudent(null);
    };

    const handleDeleteNotification = async (index) => {
        try {
            await NotificationService.deleteNotification(userId, index);
            const updatedNotifications = await NotificationService.getNotifications(userId);
            setNotifications(updatedNotifications);
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const handleSendToStudentAffair = async () => {
        try {
            await DeanService.sendApprovedStudentsToStudentAffair(userId);
            alert('Student list successfully sent to Student Affairs!');
            // Optionally reload students or statuses here
        } catch (error) {
            const msg = error.response?.data || error.message;
            if (msg && msg.includes('You cannot send the student list')) {
                alert('You cannot send the student list to Student Affairs until all secretaries in your faculty have sent their student lists.');
            } else {
                alert('Failed to send student list to Student Affairs: ' + msg);
            }
        }
    };

    const filteredStudents = approvedStudents.filter(student =>
        (student.firstName + ' ' + student.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber?.toString().includes(searchTerm)
    );

    if (showViewDetails && selectedStudent) {
        return (
            <div className="dean-container">
                <aside className="student-sidebar">
                    <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                        Notifications
                        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                    </button>
                    <button className={activeTab === 'Your Students' ? 'active' : ''} onClick={() => { setActiveTab('Your Students'); handleBack(); }}>
                        Your Students
                    </button>
                    <button className={activeTab === 'Departments' ? 'active' : ''} onClick={() => setActiveTab('Departments')}>
                        Departments
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
        <div className="dean-container">
            <aside className="student-sidebar">
                <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
                    Notifications
                    {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                </button>
                <button className={activeTab === 'Your Students' ? 'active' : ''} onClick={() => setActiveTab('Your Students')}>
                    Your Students
                </button>
                <button className={activeTab === 'Departments' ? 'active' : ''} onClick={() => setActiveTab('Departments')}>
                    Departments
                </button>
            </aside>
            <div className="main-content">
                {activeTab === 'Departments' ? (
                    <>
                        <div className="section-header">
                            <h2>Departments</h2>
                        </div>
                        <div>
                            {departmentStatuses.map((dept, index) => (
                                <div key={index} className="department-card">
                                    <div className="department-info">
                                        <div className="secretary-name">Department: {dept.name}</div>
                                    </div>
                                    <div className="status-container">
                                        <span className={`status-text ${dept.status === 'PENDING' ? 'status-pending' : 'status-sent'}`}>Student List: {dept.status}</span>
                                        {dept.status === 'PENDING' && (
                                            <button className="send-notification-btn" onClick={() => handleSendNotification(dept.secretaryId)}>
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
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Approved Students</h2>
                            <button
                                className="send-to-secretary-btn"
                                style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginLeft: 'auto' }}
                                onClick={handleSendToStudentAffair}
                            >
                                Send Student List to Student Affairs
                            </button>
                        </div>
                        <div className="search-section" style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter Student Name or ID"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: '100%', maxWidth: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <Pagination
                                filteredItems={filteredStudents}
                                itemsPerPage={5}
                            >
                                {(paginatedStudents) => (
                                    paginatedStudents.length > 0 ? (
                                        <>
                                            {paginatedStudents.map(student => (
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
                                            ))}
                                        </>
                                    ) : (
                                        <div className="no-students">No approved students found.</div>
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

export default DeanBody;
