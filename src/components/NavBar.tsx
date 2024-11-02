import React from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar fira-code-custom">
      <Branding />
      <div className="nav-links">
        <a href="/login" className="nav-link">Login</a>
        <a href="/signup" className="nav-link">Signup</a>
      </div>
    </nav>
  );
};

export default NavBar;