import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Header from '../headerForRoles/HeaderRole';
import iyteLogo from '../../assets/iyteLogo.png';

const Advisor = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                               // JWT temizlendi
    navigate("/", { replace: true });       // login/signup sayfası
  };

  return (
    <>
      <Header
        role="Advisor"
        name={user ? `${user.firstName} ` : ''}
        onLogout={handleLogout}
        logoSrc={iyteLogo}
      />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        {/* İstersen buraya başka içerik ekleyebilirsin */}
      </div>
    </>
  );
};

export default Advisor;
