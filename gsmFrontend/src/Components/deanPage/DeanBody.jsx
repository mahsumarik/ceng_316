import React, { useState } from 'react';
import './DeanBody.css';

const DeanBody = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [searchTerm, setSearchTerm] = useState('');

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
            gpa: '3.95'
        },
        {
            id: '1002',
            name: 'Bob Smith',
            status: 'Approved',
            gpa: '3.65'
        }
    ];

    const handleSendNotification = (departmentName) => {
        // This will be implemented later
        console.log('Sending notification to department:', departmentName);
    };

    const handleViewDetails = (studentId) => {
        // This will be implemented later
        console.log('View details for student:', studentId);
    };

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
                    <div>
                        <h2>Notifications</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeanBody;
