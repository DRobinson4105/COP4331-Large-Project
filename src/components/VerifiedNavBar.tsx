import React from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css";

const VerifiedNavBar: React.FC = () => {
  return (
    <nav className="navbar fira-code-custom">
      <Branding />
      <div className="nav-links">
        <a href="/Search" className="nav-link">Search Recipes</a>
        <a href="/ProfilePage" className="nav-link">Profile</a>
        <a href="/LogOut" className="nav-link">Logout</a>
      </div>
    </nav>
  );
};


export default VerifiedNavBar;