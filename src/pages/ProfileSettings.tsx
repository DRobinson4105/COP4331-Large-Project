import React, { useEffect, useState } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import "../index.css";

const ProfileSettings: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // Password state variables
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    // test data
    const fetchUserData = async () => {
      const data = {
        displayName: 'Display Name',
        userName: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'mmmmmm food',
      };
      setDisplayName(data.displayName);
      setUserName(data.userName);
      setEmail(data.email);
      setBio(data.bio);
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

  return (
    <div className="profile-settings-page">
      <VerifiedNavBar />

      <div className="settings-container">
        
        {/* Left Side: Profile Picture and User Information */}
        <div className="left-panel">
          <div className="profile-picture-section">
            <div className="avatar-placeholder"></div>
            <button className="upload-button">Upload Photo</button>
            <button className="save-picture-button">Save Picture</button>
            <button className="remove-picture-button">Remove Picture</button>
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
            <button className="verify-email-button">
              Verify Email
            </button>
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
      </div>
    </div>
  );
};

export default ProfileSettings;
