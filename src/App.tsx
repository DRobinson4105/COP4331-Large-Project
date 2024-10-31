import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPassword';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LogIn" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;