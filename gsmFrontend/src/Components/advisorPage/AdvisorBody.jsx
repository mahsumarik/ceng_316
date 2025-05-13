import React, { useState } from 'react';
import './AdvisorBody.css';
import ViewDetails from './ViewDetails';

const AdvisorBody = () => {
    const [activeTab, setActiveTab] = useState('Student List');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewDetails, setShowViewDetails] = useState(false);

    // Mock data for demonstration
    const students = [
        {
            id: '1001',
            name: 'Alice Johnson',
            status: 'Approved',
            gpa: '3.45',
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

    const handleViewDetails = (studentId) => {
        const student = students.find(s => s.id === studentId);
        setSelectedStudent(student);
        setShowViewDetails(true);
    };

    const handleBack = () => {
        setShowViewDetails(false);
        setSelectedStudent(null);
    };

    const handleSendToSecretary = () => {
        // This will be implemented later
        console.log('Sending student list to secretary');
    };

    if (showViewDetails && selectedStudent) {
        return (
            <div className="advisor-container">
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
        <div className="advisor-container">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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

export default AdvisorBody;
