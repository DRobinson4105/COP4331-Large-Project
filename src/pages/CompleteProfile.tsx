import React, { useState, useEffect } from 'react';
import Branding from '../components/Branding.tsx';
import "../index.css"
import { Link } from 'react-router-dom';

export default () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [message, setMessage] = useState('');
    const [username, setUsername] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#8ED081');
    }, []);

    async function doSignUp(event:any) : Promise<void> {
        event.preventDefault();
        
        const isAlphanumeric = /^[a-zA-Z0-9]+$/;

        if (username.length == 0 || displayName.length == 0) {
            setMessage("All fields must be filled out");
            return;
        }

        if (!isAlphanumeric.test(username)) {
            setMessage("Username must only contain alphanumeric characters");
            return;
        }

        const signUpData = JSON.parse(localStorage.getItem('signup_data') || "{}");

        let obj = {
            email:signUpData.email,
            googleId:signUpData.googleId,
            username,
            displayName
        };

        try {
            var response = await fetch(
                buildPath('user/signup'),
                {method:'POST',body:JSON.stringify(obj),headers:{'Content-Type': 'application/json'}}
            );
        } catch (error: any) {
            setMessage('Cannot complete action at this time');
            return;
        }

        var res = JSON.parse(await response.text());

        if(res.userId == undefined) {
            setMessage(res.error);
            return;
        }

        var user = {id:res.userId}
        localStorage.setItem('user_data', JSON.stringify(user));

        setMessage('Verify your account before logging in. An email has been sent.');
    };

    function handleSetUsername( e: any ) : void {
        setUsername( e.target.value );
    }
    
    function handleSetDisplayName( e: any ) : void {
        setDisplayName( e.target.value );
    }

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <br></br>
                <Branding />
            </div>
            <h2 className="center">Choose your username and display name</h2>
            <a id="codeResult" className="center">{message}</a>
            <input className="center input" type="text" id="username" placeholder="Username" onChange={handleSetUsername} style={{textAlign: "left"}} />
            <input className="center input" type="text" id="displayName" placeholder="Display Name" onChange={handleSetDisplayName} style={{textAlign: "left"}} />
            <input className="center input darkgreen button" type="submit" id="signUpButton" value = "Sign Up" onClick={doSignUp} />
            <Link to={"/LogIn"} className="center" style={{display: "block"}}>Back to Log in</Link>
            <br></br>
        </div>
    );
};