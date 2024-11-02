import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetCodeInputPage from './pages/ResetCodeInput'
import ResetPasswordPage from './pages/ResetPassword'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LogIn" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/ResetCodeInput" element={<ResetCodeInputPage />} />
        <Route path="/ResetPassword" element={<ResetPasswordPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;