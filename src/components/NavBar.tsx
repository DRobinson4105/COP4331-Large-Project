import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="w-full p-4 flex items-center justify-between fixed top-0" style={{ backgroundColor: '#F8F6DD', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* Logo */}
      <div className="flex items-center">
        <img src="/NomNom Network Logo.png" alt="Logo" className="h-10 w-10 mr-4 rounded-md" />
        <span className="text-xl font-medium">Nom Nom Network</span>
      </div>

      {/* Nav */}
      <div className="flex space-x-6">
        <a href="login" className="text-black font-medium">Login</a>
        <a href="signup" className="text-black font-medium">Sign Up</a>
      </div>
    </nav>
  );
};

export default NavBar;
