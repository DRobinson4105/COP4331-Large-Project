import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [profile, setProfile] = useState({id: "", email: "", name: ""});
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [googleId,setGoogleId] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            var response = await fetch(
                buildPath('auth/google'),
                {method:'POST',body:JSON.stringify({ access_token: codeResponse.access_token }), headers:{'Content-Type': 'application/json'}}
            );

            var res = JSON.parse(await response.text());

            setProfile({id: res.id, email: res.email, name: res.name })
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (profile.id.length != 0) {
                googleLogin();
            }
        },
        [ profile ]
    );

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#8ED081');
    }, []);

    function googleLogin() {
        setLoginName(profile.email);
        setGoogleId(profile.id);
        doLogin();
    }

    async function doLogin() : Promise<void> {
        setMessage('');

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(regex.test(email)) {
            var obj = {username:"",email:email,password:loginPassword,googleId:googleId};
        }
        else {
            var obj = {username:loginName,email:"",password:loginPassword,googleId:googleId};
        }

        try {
            var response = await fetch(
                buildPath('user/login'),
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

    async function handleLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        doLogin();
    };

    function handleSetNameOrEmail( e: any ) : void
    {
      setLoginName( e.target.value );
      setEmail( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
      setPassword( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <br></br>
                <Branding />
            </div>
            <h2 className="center">Log in to Continue</h2>
            <a id="loginResult" className="center">{message}</a>
            <input className="center input" type="text" id="loginName" placeholder="Enter your username or email" onChange={handleSetNameOrEmail} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="loginPassword" placeholder="Enter your password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Continue" onClick={handleLogin} />
            <h2 className="center">Or continue with:</h2>
            <input className="center input google" type="submit" id="loginButton" value = "Google" onClick={() => login()} />
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