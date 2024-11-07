import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetCodeInputPage from './pages/ResetCodeInput'
import ResetPasswordPage from './pages/ResetPassword'
import CompleteProfilePage from './pages/CompleteProfile'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/Search'
import Recipe from './pages/Recipe'
import Test from './pages/Test'

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
        <Route path="/search" element={<SearchPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/:username/:id" element={<Recipe />}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;