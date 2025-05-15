import React, { useState, useEffect } from 'react';
import './StudentAffairBody.css';
import ViewDetails from './ViewDetails';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';

const StudentAffairBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const { userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    // Mock data for students
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
            gpa: '3.15',
            ectsEarned: '240'
        }
    ];

    // Mock data for faculties
    const faculties = [
        {
            name: 'Engineering Faculty',
            studentListStatus: 'Pending'
        },
        {
            name: 'Science Faculty',
            studentListStatus: 'Sent'
        },
        {
            name: 'Architecture Faculty',
            studentListStatus: 'Pending'
        },
        {
            name: 'Management Faculty',
            studentListStatus: 'Sent'
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

    const handleSendNotification = (facultyName) => {
        // This will be implemented later
        console.log('Sending notification to faculty:', facultyName);
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

    // const handleDownloadDiploma = (studentId) => {
    //     // This will be implemented later
    //     console.log('Download diploma for student:', studentId);
    // };

    const handleDownloadAllDiplomas = () => {
        // This will be implemented later
        console.log('Downloading all diplomas');
    };

    // Pagination calculations for students
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.includes(searchTerm)
    );
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
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
                                        <span className={`status-text ${
                                            faculty.studentListStatus === 'Pending' ? 'status-pending' : 'status-sent'
                                        }`}>
                                            Student List: {faculty.studentListStatus}
                                        </span>
                                        {faculty.studentListStatus === 'Pending' && (
                                            <button 
                                                className="send-notification-btn"
                                                onClick={() => handleSendNotification(faculty.name)}
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
                            {currentStudents && currentStudents.length > 0 ? (
                                currentStudents.map(student => (
                                    <div key={student.id} className="student-card">
                                        <div className="student-info">
                                            <div className="student-name">Student Name: {student.name}</div>
                                            <div className="student-details">Student ID: {student.id}</div>
                                            <div className="student-details">GPA: {student.gpa}</div>
                                            <div className="student-details">ECTS: {student.ectsEarned}</div>
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
