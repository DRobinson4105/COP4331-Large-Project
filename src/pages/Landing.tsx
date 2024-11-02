import React from 'react';
import NavBar from '../components/NavBar'; 

const LandingPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="p-4">Content below the navbar...</div>
    </div>
  );
};

export default LandingPage;
