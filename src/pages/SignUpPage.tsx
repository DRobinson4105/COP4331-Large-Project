import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () =>
{
    const app_name = 'nomnom.network'
    function buildPath(route:string) : string
    {
        if (process.env.NODE_ENV != 'development') 
        {
            return 'http://' + app_name +  ':3000/' + route;
        }
        else
        {        
            return 'http://localhost:3000/' + route;
        }
    }

    const [user, setUser] = useState({access_token: ""});
    const [profile, setProfile] = useState({id: "", email: "", name: ""});
    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');
    const [googleId,setGoogleId] = React.useState('');
    const [signupPassword,setPassword] = React.useState('');
    const [signupVerifyPassword,setVerifyPassword] = React.useState('');
    const [username,setUsername] = React.useState('');
    const [displayName,setDisplayName] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user.access_token.length != 0) {
                console.log(user)
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log(res.data)
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    useEffect(
        () => {
            if (profile.id.length != 0) {
                googleLogIn();
            }
        },
        [ profile ]
    );

    function googleLogIn() {
        setUsername(profile.id);
        setGoogleId(profile.id);
        setDisplayName(profile.name);
        setEmail(profile.email);
        setPassword("");
        doSignUp();
    }

    async function doSignUp() : Promise<void> {
        setMessage('');

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!regex.test(email)) {
            setMessage("Email is invalid");
            return;
        }

        if(googleId.length == 0 && !(signupPassword === signupVerifyPassword)) {
            setMessage("Passwords do not match");
            return;
        }

        if(username.length == 0 || displayName.length == 0 || (signupPassword.length == 0 && googleId.length == 0) || email.length == 0) {
            setMessage("All fields must be filled out");
            return;
        }

        var obj = {username:username,displayName:displayName,password:signupPassword,googleId:googleId,email:email};
        var js = JSON.stringify(obj);
  
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
                window.location.href = '/Home';
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
        doSignUp();
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
        setVerifyPassword( e.target.value );
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