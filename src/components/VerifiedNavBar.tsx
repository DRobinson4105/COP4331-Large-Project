import React from 'react';
import { useNavigate } from 'react-router-dom';
import Branding from '../components/Branding.tsx';
import "../index.css";

const VerifiedNavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault(); 
    localStorage.removeItem('userId'); 
    navigate('/'); 
  };

  return (
    <nav className="navbar fira-code-custom">
      <Branding />
      <div className="nav-links">
        <a href="/Search" className="nav-link">Search Recipes</a>
        <a href="/ProfilePage" className="nav-link">Profile</a>
        <a href="/" onClick={handleLogout} className="nav-link">Logout</a>
      </div>
    </nav>
  );
};

export default VerifiedNavBar;