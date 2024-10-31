import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const LoginPage = () =>
{
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => console.log("Yay!"),
        onError: (error) => console.log('Login Failed:', error)
    });

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
    };

    function handleSetLoginName( e: any ) : void
    {
      setLoginName( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
      setPassword( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <Branding />
            </div>
            <h2 className="center">Log in to Continue</h2>
            <input className="center input" type="text" id="loginName" placeholder="Enter your username or email" onChange={handleSetLoginName} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="loginPassword" placeholder="Enter your password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen" type="submit" id="loginButton" value = "Continue" onClick={doLogin} style={{color: "white"}}/>
            <h2 className="center">Or continue with:</h2>
            <input className="center input" type="submit" id="loginButton" value = "Google" onClick={() => login()} style={{backgroundColor: "white"}}/>
            <div className="center">
                <Link to={"/ForgotPassword"}>Forgot Password?</Link>
                <a> • </a>
                <Link to={"/SignUp"}>Create an Account</Link>
            </div>
            <br></br>
        </div>
    );
};
    
export default LoginPage;