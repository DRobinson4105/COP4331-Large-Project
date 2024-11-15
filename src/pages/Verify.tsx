import { useState, useEffect } from 'react';
import "../index.css"
import { useSearchParams } from 'react-router-dom';

const LoginPage = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [message,setMessage] = useState('');

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#8ED081');

        const [searchParams] = useSearchParams();

        // Access query parameters
        const id = searchParams.get('id');
        const code = searchParams.get('code');

        setMessage('Processing verification')

        const apiCall = async () => {
            var response = await fetch(
                buildPath('user/verifyAccount'),
                {method:'POST',body:JSON.stringify({ id, code }), headers:{'Content-Type': 'application/json'}}
            );
    
            var res = await response.json();

            setMessage(res.error)
        }
        
        apiCall()
    }, []);

    return(
        <div className="accentColumn">
            <div className="center" style={{marginTop: "25px"}}>
                <h1>{message}</h1>
            </div>
        </div>
    );
};
    
export default LoginPage;