import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () =>
{
    const [message,setMessage] = useState('');
    const [code,setCode] = React.useState('');

    async function doRecovery(event:any) : Promise<void>
    {
        event.preventDefault();

        if(code.length == 0) {
            setMessage("Code field cannot be empty");
        }
        else {
            window.location.href = '/resetpassword';
        }
    };

    function handleSetCode( e: any ) : void
    {
      setCode( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <Branding />
            </div>
            <h2 className="center">Enter Code</h2>
            <a id="codeResult" className="center">{message}</a>
            <input className="center input" type="text" id="loginName" placeholder="Enter six-digit code" onChange={handleSetCode} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Verify code" onClick={doRecovery} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Back to Log in</Link>
            <br></br>
        </div>
    );
};
    
export default ForgotPasswordPage;