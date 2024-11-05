import React, { useEffect } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import "../index.css";

const ProfilePage: React.FC = () => {

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');
  }, []);

  return (
    <div>
      <VerifiedNavBar /> 
      <div>
        <h1>Profile Page WIP</h1>
      </div>
    </div>  
  );
};

export default ProfilePage;
