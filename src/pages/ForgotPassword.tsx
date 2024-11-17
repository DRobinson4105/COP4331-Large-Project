import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () =>
{
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#8ED081');
    }, []);

    async function doRecovery(event:any) : Promise<void>
    {
        event.preventDefault();

        if(email.length == 0) {
            setMessage("Email field cannot be empty");
        }
        else {
            var response = await fetch(
                buildPath('user/passwordReset'),
                {method:'POST',body:JSON.stringify({ email }), headers:{'Content-Type': 'application/json'}}
            );

            var res = await response.json();

            if (!response.ok) {
                setMessage(res.error);
            } else {
                setMessage("If there is an account with the provided email address, an email will be sent.");
            }
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