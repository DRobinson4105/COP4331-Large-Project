import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import "../index.css";

const LandingPage: React.FC = () => {

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');
  }, []);

  return (
    <div className="landing-page-bg">
      <NavBar />
      <div className="landing-title">Nom Nom Network</div>
      <div className="landing-body">
        Discover a world of flavors with Nom Nom Network
      </div>
      <img src="/food2.webp" alt="Food image" className="landing-logo" />

    </div>
  );
};

export default LandingPage;
  