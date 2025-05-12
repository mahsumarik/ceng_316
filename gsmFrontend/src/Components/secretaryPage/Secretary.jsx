import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Header from '../headerForRoles/HeaderRole';
import iyteLogo from '../../assets/iyteLogo.png';
import SecretaryBody from "./SecretaryBody";

const Secretary = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                               // JWT temizlendi
    navigate("/", { replace: true });       // login/signup sayfası
  };

  return (
    <>
      <Header
        role="Secretary"
        name={user ? `${user.firstName} ` : ''}
        onLogout={handleLogout}
        logoSrc={iyteLogo}
      />
      <SecretaryBody />
    </>
  );
};

export default Secretary;
