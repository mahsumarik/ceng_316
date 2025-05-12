import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Header from '../headerForRoles/HeaderRole';
import StudentAffairBody from './StudentAffairBody';
import iyteLogo from '../../assets/iyteLogo.png';

const StudentAffair = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                               // JWT temizlendi
    navigate("/", { replace: true });       // login/signup sayfası
  };

  return (
    <>
      <Header
        role="Student Affairs"
        name={user ? `${user.firstName} ` : ''}
        onLogout={handleLogout}
        logoSrc={iyteLogo}
      />
      <StudentAffairBody />
    </>
  );
};

export default StudentAffair;
