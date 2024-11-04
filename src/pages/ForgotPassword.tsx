import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () =>
{
    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');

    async function doRecovery(event:any) : Promise<void>
    {
        event.preventDefault();

        if(email.length == 0) {
            setMessage("Email field cannot be empty");
        }
        else {
            window.location.href = '/resetcodeinput';
        }
    };

    function handleSetEmail( e: any ) : void
    {
      setEmail( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <br></br>
                <Branding />
            </div>
            <h2 className="center">Forgot Password?</h2>
            <a id="emailResult" className="center">{message}</a>
            <input className="center input" type="text" id="loginName" placeholder="Enter your email" onChange={handleSetEmail} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Send recovery email" onClick={doRecovery} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Back to Log in</Link>
            <br></br>
        </div>
    );
};
    
export default ForgotPasswordPage;