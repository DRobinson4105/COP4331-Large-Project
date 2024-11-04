import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

const ResetPasswordPage = () =>
{
    const [message,setMessage] = useState('');
    const [newPassword,setNewPassword] = React.useState('');
    const [verifyPassword,setVerifyPassword] = React.useState('');

    async function doReset(event:any) : Promise<void>
    {
        event.preventDefault();

        if(newPassword.length == 0 || verifyPassword.length == 0) {
            setMessage("Password fields cannot be empty");
            return;
        }

        if(newPassword === verifyPassword) {
          window.location.href = '/logIn';
        }
        else {
          setMessage('Passwords do not match');
        }  
    };

    function handleSetNewPassword( e: any ) : void
    {
      setNewPassword( e.target.value );
    }

    function handleSetVerifyPassword( e: any ) : void
    {
      setVerifyPassword( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <br></br>
                <Branding />
            </div>
            <h2 className="center">Reset Password</h2>
            <a id="passwordResult" className="center">{message}</a>
            <input className="center input" type="password" id="newPassword" placeholder="Enter new password" onChange={handleSetNewPassword} style={{textAlign: "left"}}/>
            <input className="center input" type="password" id="verifyNewPassword" placeholder="Re-enter new password" onChange={handleSetVerifyPassword} style={{textAlign: "left"}}/>
            <input className="center input darkgreen button" type="submit" id="resetButton" value = "Reset Password" onClick={doReset} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Back to Log in</Link>
            <br></br>
        </div>
    );
};
    
export default ResetPasswordPage;