import React, { useState } from 'react';
import './StudentAffairBody.css';

const StudentAffairBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for students
    const students = [
        {
            id: '1001',
            name: 'Alice Johnson',
            status: 'Approved',
            gpa: '3.95'
        },
        {
            id: '1002',
            name: 'Bob Smith',
            status: 'Approved',
            gpa: '3.15'
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

    const handleSendNotification = (facultyName) => {
        // This will be implemented later
        console.log('Sending notification to faculty:', facultyName);
    };

    const handleViewDetails = (studentId) => {
        // This will be implemented later
        console.log('View details for student:', studentId);
    };

    const handleDownloadDiploma = (studentId) => {
        // This will be implemented later
        console.log('Download diploma for student:', studentId);
    };

    const handleDownloadAllDiplomas = () => {
        // This will be implemented later
        console.log('Downloading all diplomas');
    };

    return (
        <div className="student-affairs-container">
            <div className="sidebar">
                <div 
                    className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Notifications')}
                >
                    Notifications
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Faculties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Faculties')}
                >
                    Faculties
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Student List' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Student List')}
                >
                    Student List
                </div>
            </div>

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
                                        <div className="student-actions">
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => handleViewDetails(student.id)}
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                className="download-diploma-btn"
                                                onClick={() => handleDownloadDiploma(student.id)}
                                            >
                                                Download Diploma
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                ) : (
                    <div>
                        <h2>Notifications</h2>
                        <p>No notifications to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAffairBody;
