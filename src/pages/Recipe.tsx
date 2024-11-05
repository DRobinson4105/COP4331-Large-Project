import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import "../index.css";

const RecipePage: React.FC = () => {

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#FFFEEE');
    }, []);

    return (
        <div className="landing-page-bg">
        <NavBar />
        </div>
    );
};

export default RecipePage;