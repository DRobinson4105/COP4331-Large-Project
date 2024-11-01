import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const SignUpPage = () =>
{
    const [signupName,setSignupName] = React.useState('');
    const [signupPassword,setPassword] = React.useState('');
    const [signupVerifyPassword,setVerifyPassword] = React.useState('');
    const [username,setUsername] = React.useState('');
    const [displayName,setDisplayName] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => console.log("Yay!"),
        onError: (error) => console.log('Login Failed:', error)
    });

    async function doSignUp(event:any) : Promise<void>
    {
        event.preventDefault();
    };

    function handleSetUsername( e: any ) : void
    {
      setUsername( e.target.value );
    }

    function handleSetDisplayName( e: any ) : void
    {
      setDisplayName( e.target.value );
    }

    function handleSetSignupName( e: any ) : void
    {
      setSignupName( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
      setPassword( e.target.value );
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
            <h2 className="center">Sign up to Continue</h2>
            <input className="center input" type="text" id="username" placeholder="Enter a username" onChange={handleSetUsername} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="displayName" placeholder="Enter a display name" onChange={handleSetDisplayName} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="signupName" placeholder="Enter your email" onChange={handleSetSignupName} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupPassword" placeholder="Enter a password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupVerifyPassword" placeholder="Retype your password" onChange={handleSetVerifyPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen" type="submit" id="loginButton" value = "Sign Up" onClick={doSignUp} style={{color: "white"}}/>
            <h2 className="center">Or continue with:</h2>
            <input className="center input" type="submit" id="loginButton" value = "Google" onClick={() => login()} style={{backgroundColor: "white"}}/>
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Already have an account? Log in</Link>
            <br></br>
        </div>
    );
};
    
export default SignUpPage;