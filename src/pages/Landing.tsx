import React from 'react';
import NavBar from '../components/NavBar';
import Logo from "../assets/NomNom Network Logo.png"
import "../index.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page-bg">
      <NavBar />
      <div className="landing-title">Nom Nom Network</div>
      <div className="landing-body">
        Discover a world of flavors with Nom Nom Network
      </div>
      <img src={Logo} alt="Logo" className="landing-logo" />
    </div>
  );
};

export default LandingPage;
  