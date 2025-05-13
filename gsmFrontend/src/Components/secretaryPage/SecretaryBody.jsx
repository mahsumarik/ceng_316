import React, { useState } from 'react';
import './SecretaryBody.css';
import ViewDetails from './ViewDetails';

const SecretaryBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);

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
            gpa: '3.65',
            ectsEarned: '240'
        }
    ];

    // Mock data for advisors
    const advisors = [
        {
            name: 'Dr. Alice Brown',
            studentListStatus: 'Pending'
        },
        {
            name: 'Prof. Bob Green',
            studentListStatus: 'Sent'
        },
        {
            name: 'Dr. Clara White',
            studentListStatus: 'Pending'
        },
        {
            name: 'Prof. Xavier',
            studentListStatus: 'Pending'
        },
        {
            name: 'Dr. Hill',
            studentListStatus: 'Sent'
        }
    ];

    const handleViewDetails = (studentId) => {
        const student = students.find(s => s.id === studentId);
        setSelectedStudent(student);
        setShowViewDetails(true);
    };

    const handleBack = () => {
        setShowViewDetails(false);
        setSelectedStudent(null);
    };

    const handleSendNotification = (advisorName) => {
        // This will be implemented later
        console.log('Sending notification to advisor:', advisorName);
    };

    const handleSendToDean = () => {
        // This will be implemented later
        console.log('Sending student list to dean');
    };

    if (showViewDetails && selectedStudent) {
        return (
            <div className="secretary-container">
                <div className="sidebar">
                    <div 
                        className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Notifications')}
                    >
                        Notifications
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'Student List' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('Student List');
                            handleBack();
                        }}
                    >
                        Student List
                    </div>
                    <div 
                        className={`sidebar-item ${activeTab === 'Advisors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Advisors')}
                    >
                        Advisors
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
        <div className="secretary-container">
            <div className="sidebar">
                <div 
                    className={`sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Notifications')}
                >
                    Notifications
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Student List' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Student List')}
                >
                    Student List
                </div>
                <div 
                    className={`sidebar-item ${activeTab === 'Advisors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Advisors')}
                >
                    Advisors
                </div>
            </div>

            <div className="main-content">
                {activeTab === 'Student List' ? (
                    <>
                        <div className="section-header">
                            <h2>Your Students</h2>
                            <button className="send-to-dean-btn" onClick={handleSendToDean}>
                                Send Student List to Dean's Office
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
                ) : activeTab === 'Advisors' ? (
                    <>
                        <div className="section-header">
                            <h2>Advisors</h2>
                        </div>
                        <div>
                            {advisors.map((advisor, index) => (
                                <div key={index} className="advisor-card">
                                    <div className="advisor-info">
                                        <div className="advisor-name">Name: {advisor.name}</div>
                                    </div>
                                    <div className="student-list-status">
                                        <span className={`status-text ${
                                            advisor.studentListStatus === 'Pending' ? 'status-pending' : 'status-sent'
                                        }`}>
                                            Student List: {advisor.studentListStatus}
                                        </span>
                                        {advisor.studentListStatus === 'Pending' && (
                                            <button 
                                                className="send-notification-btn"
                                                onClick={() => handleSendNotification(advisor.name)}
                                            >
                                                Send Notification
                                            </button>
                                        )}
                                    </div>
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

export default SecretaryBody;
