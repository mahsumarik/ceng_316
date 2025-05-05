import React from 'react';
import './HeaderRole.css';


const Header = ({ role, name, onLogout, logoSrc }) => {
  return (
    <header className="custom-header">
      <div className="header-left">
        <img src={logoSrc} alt="Logo" className="header-logo" />
        <span className="header-title">Iztech Graduation Management</span>
      </div>
      <div className="header-right">
        <span className="header-role"><b>Role:</b> {role}</span>
        <span className="header-name"><b>Name:</b> {name}</span>
        <button className="header-logout" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header; 