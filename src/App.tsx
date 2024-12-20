import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPassword'
import CompleteProfilePage from './pages/CompleteProfile'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/Search'
import Recipe from './pages/Recipe'
import ProfileSettings from './pages/ProfileSettings'
import CreateRecipe from './pages/CreateRecipe'
import Test from './pages/Test'
import Verify from './pages/Verify'
import EditRecipe from './pages/EditRecipe'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/completeprofile" element={<CompleteProfilePage />} />
        <Route path="/Search" element={<SearchPage />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/:id" element={<Recipe />}/>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/CreateRecipe" element={<CreateRecipe />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
      </Routes>
    </Router>
  );
};

export default App;