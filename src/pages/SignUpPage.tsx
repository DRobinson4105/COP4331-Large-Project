import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

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

    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');
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
        setMessage('');

        var obj = {username:username,displayName:displayName,password:signupPassword,googleId:null,email:email};
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
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.userId}
                localStorage.setItem('user_data', JSON.stringify(user));
  
                setMessage('');
                window.location.href = '/Home';
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
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
            <a id="loginResult">{message}</a>
            <input className="center input" type="text" id="username" placeholder="Enter a username" onChange={handleSetUsername} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="displayName" placeholder="Enter a display name" onChange={handleSetDisplayName} style={{textAlign: "left"}} />
            <input className="center input" type="email" id="signupEmail" placeholder="Enter your email" onChange={handleSetEmail} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupPassword" placeholder="Enter a password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="signupVerifyPassword" placeholder="Retype your password" onChange={handleSetVerifyPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Sign Up" onClick={doSignUp} />
            <h2 className="center">Or continue with:</h2>
            <input className="center input google" type="submit" id="loginButton" value = "Google" onClick={() => login()} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Already have an account? Log in</Link>
            <br></br>
        </div>
    );
};
    
export default SignUpPage;