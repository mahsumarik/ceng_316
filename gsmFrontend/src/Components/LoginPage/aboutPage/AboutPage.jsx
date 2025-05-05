import React from 'react';
import Header from '../header/Header';
import './AboutPage.css';
import { FaGraduationCap, FaClipboardCheck, FaClock, FaUsers, FaShieldAlt, FaChartLine } from 'react-icons/fa';

function AboutPage() {
  const features = [
    {
      icon: <FaGraduationCap />,
      title: "Digital Graduation Management",
      description: "Modernizing graduation processes by digitizing traditionally signed documents."
    },
    {
      icon: <FaClipboardCheck />,
      title: "Automated Workflow",
      description: "Speeds up processes and reduces error rates by automating manual procedures."
    },
    {
      icon: <FaClock />,
      title: "Time Efficiency",
      description: "Accelerates processes for staff and students by reducing administrative workload."
    },
    {
      icon: <FaUsers />,
      title: "Centralized Management",
      description: "Provides a single platform for managing graduation procedures across all departments."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure System",
      description: "Ensures top-level document security and data privacy."
    },
    {
      icon: <FaChartLine />,
      title: "Increased Productivity",
      description: "Enhances institutional efficiency by optimizing business processes."
    }
  ];

  return (
    <div>
      <Header />
      <div className="about-container">
        <div className="about-content">
          <h1 className="about-title">About Us</h1>
          <p className="about-description">
            IZTECH Graduation Management System (GMS) is a comprehensive digital platform designed to 
            effectively manage and streamline graduation processes. Our system aims to enhance the 
            efficiency and accuracy of all graduation-related tasks by digitizing traditionally signed 
            documents and automating manual processes. By centralizing workflows and streamlining 
            operations, we aim to reduce administrative overhead across all departments at IZTECH.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
