import React, { useState } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';

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

    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => console.log("Yay!"),
        onError: (error) => console.log('Login Failed:', error)
    });

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        setMessage('');

        var obj = {username:loginName,password:loginPassword};
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
            <a id="loginResult" className="center">{message}</a>
            <input className="center input" type="text" id="loginName" placeholder="Enter your username or email" onChange={handleSetLoginName} style={{textAlign: "left"}} />
            <input className="center input" type="password" id="loginPassword" placeholder="Enter your password" onChange={handleSetPassword} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="loginButton" value = "Continue" onClick={doLogin} />
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