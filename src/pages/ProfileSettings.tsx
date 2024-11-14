import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifiedNavBar from '../components/VerifiedNavBar';
import "../index.css";

const ProfileSettings: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('noPFP.png');
  
  // Password state variables
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data (test data for now)
    const fetchUserData = async () => {
      const data = {
        displayName: 'Display Name',
        userName: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'mmmmmm food',
        profilePicture: '', // Example: No picture URL provided
      };
      setDisplayName(data.displayName);
      setUserName(data.userName);
      setEmail(data.email);
      setBio(data.bio);

      // Set profile picture (default if not provided)
      setProfilePicture(data.profilePicture || 'noPFP.png');
    };

    fetchUserData();
  }, []);

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleUpdatePassword = () => {
    console.log("Password updated");
  };

  // Navigate back to ProfilePage
  const handleSaveAndExit = () => {
    handleSaveSettings();
    navigate('/ProfilePage');
  };

  return (
    <div className="profile-settings-page">
      <VerifiedNavBar />

      <div className="settings-container">
        {/* Left Side: Profile Picture and User Information */}
        <div className="left-panel">
          <div className="profile-picture-section">
            <img
              src={profilePicture}
              alt="Profile"
              className="avatar-placeholder"
            />
            <button className="upload-button">Upload Photo</button>
          </div>
          <div className="user-info-section">
            <h2>User Information</h2>
            <label>
              Display Name:
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                className="settings-input"
              />
            </label>
            <label>
              Username:
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="settings-input"
              />
            </label>
            <label>
              About Me:
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                maxLength={255}
                className="settings-textarea"
                placeholder="‘About Me’ Description"
              />
              <span className="char-counter">{bio.length}/255</span>
            </label>
            <button onClick={handleSaveSettings} className="save-changes-button">
              Save Changes
            </button>
            {settingsSaved && <p className="save-confirmation">Settings saved successfully!</p>}
          </div>
        </div>

        {/* Right Side: Scrollable Content */}
        <div className="right-panel">
          <div className="update-email-section">
            <h2>Update Email</h2>
            <label>
              Email:
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="settings-input"
              />
            </label>
          </div>

          <div className="password-update-section">
            <h2>Update Password</h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="settings-input"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="settings-input"
            />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter New Password"
              className="settings-input"
            />
            <button onClick={handleUpdatePassword} className="update-password-button">
              Update Password
            </button>
          </div>
        </div>

        {/* Save and Exit Button */}
        <div className="save-exit-section" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleSaveAndExit}
            className="save-exit-button"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save and Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
