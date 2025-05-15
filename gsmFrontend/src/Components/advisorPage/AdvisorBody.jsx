import React, { useState, useEffect } from 'react';
import './AdvisorBody.css';
import ViewDetails from './ViewDetails';
import AdvisorService from '../../services/AdvisorService';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';

const AdvisorBody = () => {
    const { userId } = useAuth();  // advisorId = userId
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;
    const [notifications, setNotifications] = useState([]);


    //******************************************************************************************************** */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await AdvisorService.getStudentsByAdvisorId(userId);
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

        if (userId) {
            fetchStudents();
            loadNotifications();
        }
    }, [userId]);

    //******************************************************************************************************** */

    const handleViewDetails = (studentId) => {
        const student = students.find(s => s.id === studentId);
        setSelectedStudent(student);
        setShowViewDetails(true);
    };

    //******************************************************************************************************** */
    const handleBack = () => {
        setShowViewDetails(false);
        setSelectedStudent(null);
    };
    //******************************************************************************************************** */

    const handleSendToSecretary = async () => {
    try {
        await AdvisorService.sendApprovedStudentsToSecretary(userId);
        alert("Success");
    } catch (error) {
        console.error("Full error object:", error);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        }
            alert("Failed to send: " + error.response?.data || error.message);
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
    //******************************************************************************************************** */
    // Pagination calculations
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const filteredStudents = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber.includes(searchTerm)
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
      <div className="advisor-container">
        <div className="sidebar">
          <div className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
               onClick={() => setActiveTab('Notifications')}>
            Notifications
          </div>
          <div className={`sidebar-item ${activeTab === 'Student List' ? 'active' : ''}`}
               onClick={() => {
                 setActiveTab('Student List');
                 handleBack();
               }}>
            Student List
          </div>
        </div>
        <div className="main-content">
          <div className="view-details-header">
            <button className="back-btn" onClick={handleBack}>
              ← Back to Student List
            </button>
          </div>
          <ViewDetails student={selectedStudent} setSelectedStudent={setSelectedStudent} />
        </div>
      </div>
    );
  }

    return (
        <div className="advisor-container">
            <div className="sidebar">
                <div className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                     onClick={() => setActiveTab('Notifications')}>
                    Notifications
                </div>
                <div className={`sidebar-item ${activeTab === 'Student List' ? 'active' : ''}`}
                     onClick={() => setActiveTab('Student List')}>
                    Student List
                </div>
            </div>

            <div className="main-content">
                {activeTab === 'Student List' ? (
                    <>
                        <div className="student-list-header">
                            <h2>Student List</h2>
                            <button className="send-list-btn" onClick={handleSendToSecretary}>
                                Send Student List to Secretary
                            </button>
                        </div>
                        <div>
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Enter Student Name or ID"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // arama yaptıkça baştan başla
                                }}
                            />

                            {currentStudents.map(student => (
                                <div key={student.id} className="student-card">
                                    <div className="student-info">
                                        <div className="student-name">
                                            Student Name: {student.firstName} {student.lastName}
                                        </div>
                                        <div className="student-details">Student ID: {student.studentNumber}</div>
                                        <div className="student-details">
                                            Status: <span className={`status-text ${student.advisorStatus?.toLowerCase()}`}>{student.advisorStatus}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="view-details-btn"
                                        onClick={() => handleViewDetails(student.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}

                            {filteredStudents.length > studentsPerPage && (
                                <div className="pagination-controls">
                                    <button 
                                        onClick={handlePrevPage} 
                                        disabled={currentPage === 1}
                                    >
                                        ←
                                    </button>
                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            // Show first page, last page, current page, and pages around current page
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        className={`page-number ${pageNumber === currentPage ? 'active' : ''}`}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return <span key={pageNumber}>...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button 
                                        onClick={handleNextPage} 
                                        disabled={currentPage === totalPages}
                                    >
                                        →
                                    </button>
                                    <div className="page-info">
                                        Page {currentPage} of {totalPages}
                                    </div>
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

export default AdvisorBody;
