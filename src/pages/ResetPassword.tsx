import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

const ResetPasswordPage = () =>
{
    const [code,setCode] = React.useState('');
    const [newPassword,setNewPassword] = React.useState('');
    const [verifyPassword,setVerifyPassword] = React.useState('');

    async function doReset(event:any) : Promise<void>
    {
        event.preventDefault();
    };

    function handleSetCode( e: any ) : void
    {
      setCode( e.target.value );
    }

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
                <Branding />
            </div>
            <h2 className="center">Reset Password</h2>
            <input className="center input" type="text" id="resetCode" placeholder="Enter code" onChange={handleSetCode} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="newPassword" placeholder="Enter new password" onClick={handleSetNewPassword} style={{textAlign: "left"}}/>
            <input className="center input" type="text" id="verifyNewPassword" placeholder="Re-enter new password" onClick={handleSetVerifyPassword} style={{textAlign: "left"}}/>
            <input className="center input darkgreen button" type="submit" id="resetButton" value = "Reset Password" onClick={doReset} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Back to Log in</Link>
            <br></br>
        </div>
    );
};
    
export default ResetPasswordPage;