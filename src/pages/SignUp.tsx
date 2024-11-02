import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () =>
{
    function buildPath(route:string) : string {  
        return `http://localhost:${import.meta.env.VITE_SERVER_PORT || 3000}/${route}`;
    }

    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [confirmedPassword,setConfirmedPassword] = React.useState('');
    const [username,setUsername] = React.useState('');
    const [displayName,setDisplayName] = React.useState('');

    const login = useGoogleLogin({
            onSuccess: (codeResponse) => {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${codeResponse.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        let profile = res.data
                        doSignUp(profile.id, profile.name, "", profile.id, profile.email)
                    })
                    .catch((err) => console.log(err));

            },
            onError: (error) => console.log('Login Failed:', error)
        });

    async function doSignUp(username: string, displayName: string, password: string, googleId: string, email: string) : Promise<void> {
        setMessage('');

        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isAlphanumeric = /^[a-zA-Z0-9]+$/;


        if(!isValidEmail.test(email)) {
            setMessage("Email is invalid");
            return;
        }

        if(googleId.length == 0 && password !== confirmedPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if(username.length == 0 || displayName.length == 0 || (password.length == 0 && googleId.length == 0) || email.length == 0) {
            setMessage("All fields must be filled out");
            return;
        }

        if (!isAlphanumeric.test(username)) {
            setMessage("Username must only contain alphanumeric characters");
            return;
        }

        let obj = {username:username,displayName:displayName,password:password,googleId:googleId,email:email};
        let js = JSON.stringify(obj);
        
        try
        {    
            const response = await fetch(buildPath('user/signup'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            var res = JSON.parse(await response.text());
  
            if( res.userId == undefined )
            {
                setMessage(res.error);
            }
            else
            {
                var user = {id:res.userId}
                localStorage.setItem('user_data', JSON.stringify(user));
  
                setMessage('');
                window.location.href = '/home';
            }
        }
        catch(error:any)
        {
            console.error(error.toString());
            return;
        }
    }

    async function handleSignUp(event:any) : Promise<void>
    {
        event.preventDefault();
        doSignUp(username, displayName, password, "", email);
    };

    function handleSetUsername( e: any ) : void
    {
        setUsername( e.target.value );
    }

    function handleSetDisplayName( e: any ) : void
    {
        setDisplayName( e.target.value );
    }

    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
        setPassword( e.target.value );
    }

    function handleSetVerifyPassword( e: any ) : void
    {
        setConfirmedPassword( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <Branding />
            </div>
            <h2 className="center">Sign up to Continue</h2>
            <a id="signupResult" className="center">{message}</a>
            <input className="center input" type="text" id="username" placeholder="Enter a username" onChange={handleSetUsername} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="displayName" placeholder="Enter a display name" onChange={handleSetDisplayName} style={{textAlign: "left"}} />
            <input className="center input" type="email" id="signupEmail" placeholder="Enter your email" onChange={handleSetEmail} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupPassword" placeholder="Enter a password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupVerifyPassword" placeholder="Retype your password" onChange={handleSetVerifyPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Sign Up" onClick={handleSignUp} />
            <h2 className="center">Or continue with:</h2>
            <input className="center input google" type="submit" id="loginButton" value = "Google" onClick={() => login()} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Already have an account? Log in</Link>
            <br></br>
        </div>
    );
};
    
export default SignUpPage;