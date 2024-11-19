import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifiedNavBar from '../components/VerifiedNavBar';
import "../index.css";

const ProfileSettings: React.FC = () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }
    
  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogle, setIsGoogle] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('noPFP.png');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [message3, setMessage3] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Password state variables
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data (test data for now)
    const fetchUserData = async () => {
      const id = JSON.parse(localStorage.getItem('user_data') || '{}').id;

      if (!id) {
          console.error('No user ID found in local storage');
          return;
      }

      setUserId(id)

      const response = await fetch(buildPath('user/get'), {
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await response.json();
      
      setDisplayName(res.name);
      setUserName(res.username);
      setEmail(res.email);
      setBio(res.desc || '');
      setPassword(res.password)
      setIsGoogle(res.isGoogle)

      // Set profile picture (default if not provided)
      setProfilePicture(res.image || 'noPFP.png');
      await new Promise(r => setTimeout(r, 1000));
    };

    fetchUserData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      var response = await fetch(
          buildPath('user/update'),
          {method:'POST',body:JSON.stringify({ id: userId, name: displayName, username: userName, desc: bio}),headers:{'Content-Type': 'application/json'}}
      );

      let res = await response.json()
      var error = res.error
      setMessage(error)
    } catch (error) {
      console.log(error)
      return;
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64Image = reader.result?.split(',')[1];
          var response = await fetch(
            buildPath('user/update'),
            {method:'POST',body:JSON.stringify({ id: userId, image: base64Image }),headers:{'Content-Type': 'application/json'}}
          );
    
          let res = await response.json()
          var error = res.error
          setMessage3(error)
          setProfilePicture(reader.result)
        } else {
          setMessage3('FileReader result is not a string');
        }
      };
      reader.readAsDataURL(file);
    } else {
      setMessage3('No file selected');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword == "") {
      setMessage2("Empty new password")
      return
    }

    if (newPassword != confirmNewPassword) {
      setMessage2('New Passwords don\'t match')
      return
    }

    if (currentPassword != password) {
      setMessage2('Incorrect current password')
      return
    }

    try {
      var response = await fetch(
          buildPath('user/update'),
          {method:'POST',body:JSON.stringify({ id: userId, password: newPassword }),headers:{'Content-Type': 'application/json'}}
      );

      let res = await response.json()
      var error = res.error
      setMessage2(error)
    } catch (error) {
      console.log(error)
      return;
    }
  };

  // Navigate back to ProfilePage
  const handleSaveAndExit = () => {
    handleSaveSettings();
    navigate('/ProfilePage');
  };

  const deleteAccount = async () => {
    const response = await fetch(buildPath('user/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${errorText}`);
        return;
    }

    navigate('/');
  }

  return (
    <div className="profile-settings-page">
      <VerifiedNavBar />

      <div className="settings-container">
        {/* Left Side: Profile Picture and User Information */}
        <div className="left-panel">
          <div className="profile-picture-section">
          <img src={profilePicture} className='recipe-image' alt="profilePicture" />

            <h1>Upload Image</h1>
              <form onSubmit={handleImageUpload}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
              </form>
              <p className="save-confirmation">{message3}</p>
            {/* <label htmlFor="upload-button">
              <button>Upload Image</button>
            </label> */}
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
            <p className="save-confirmation">{message}</p>
          </div>
        </div>

        {/* Right Side: Scrollable Content */}
        <div className="right-panel">
          <div className="update-email-section">
            <h2>Email: {email}</h2>
          </div>

          {!isGoogle && <div className="password-update-section">
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
            <p className="save-confirmation">{message2}</p>
          </div>}
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
        <div className="save-exit-section" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={deleteAccount}
            className="save-exit-button"
            style={{
              padding: '10px 20px',
              backgroundColor: 'red',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;