import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetCodeInputPage from './pages/ResetCodeInput'
import ResetPasswordPage from './pages/ResetPassword'
import CompleteProfilePage from './pages/CompleteProfile'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/Search'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/resetcodeinput" element={<ResetCodeInputPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/completeprofile" element={<CompleteProfilePage />} />
        <Route path="/Search" element={<SearchPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;