import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [confirmedPassword,setConfirmedPassword] = React.useState('');
    const [username,setUsername] = React.useState('');
    const [displayName,setDisplayName] = React.useState('');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#8ED081');
    }, []);

    const login = useGoogleLogin({
            onSuccess: async (codeResponse) => {
                var response = await fetch(
                    buildPath('auth/google'),
                    {method:'POST',body:JSON.stringify({ access_token: codeResponse.access_token }), headers:{'Content-Type': 'application/json'}}
                );

                var res = JSON.parse(await response.text());
                finishGoogleLogin(res.email, res.id)
            },
            onError: (error) => console.log('Sign Up Failed:', error)
        });

    async function finishGoogleLogin(email: string, googleId: string) {
        setMessage('')

        try {
            var response = await fetch(
                buildPath('user/verifyemail'),
                {method:'POST',body:JSON.stringify({ email }), headers:{'Content-Type': 'application/json'}}
            );
        } catch (error: any) {
            setMessage('Cannot complete action at this time');
            return;
        }

        var res = JSON.parse(await response.text());

        if (res.taken) {
            setMessage('Account with email exists')
            return;
        }

        localStorage.setItem('signup_data', JSON.stringify({email, googleId}));
        window.location.href = '/completeprofile';
    }

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
   
        let response;

        try {
            response = await fetch(
                buildPath('user/signup'),
                {method:'POST',body:JSON.stringify(obj),headers:{'Content-Type': 'application/json'}}
            );
        } catch (error: any) {
            setMessage('Cannot complete action at this time');
            return;
        }


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
            window.location.href = '/ProfilePage';
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
                <br></br>
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