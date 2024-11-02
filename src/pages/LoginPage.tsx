import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () =>
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

    const [user, setUser] = useState({access_token: "0"});
    const [profile, setProfile] = useState({id: "", email: "", name: ""});
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [googleId,setGoogleId] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
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
                googleLogin();
            }
        },
        [ profile ]
    );

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

        var js = JSON.stringify(obj);
  
        try
        {    
            const response = await fetch(buildPath('user/login'),
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