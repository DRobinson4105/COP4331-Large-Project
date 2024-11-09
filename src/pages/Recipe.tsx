import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import "../index.css";
import RecipeImage from '../assets/Default Recipe Picture.png'

const RecipePage: React.FC = () => {

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#FFFEEE');
    }, []);

    return (
        <div>
            <NavBar />
            <div className="recipe-component">
                <div style={{display: "flex"}}>
                    <img src={RecipeImage} style={{width: 200, height: 200, display: "inline-block", verticalAlign: "middle", margin: "10px", border: "1px solid black"}} alt="Logo"/>
                    <div style={{display: "inline-block", verticalAlign: "middle", marginRight: "10px", width: "calc((100% - 244px) / 2)"}}>
                        <p className="recipe-component">Recipe Title</p>
                        <p className="recipe-component">Author</p>
                        <div className="recipe-component">
                            <p>Protein:</p>
                            <p>Calories:</p>
                            <p>Fat:</p>
                            <p>Carbs:</p>
                        </div>
                    </div>
                    <p className="recipe-component" style={{display: "inline-block", verticalAlign: "top", width: "calc((100% - 244px) / 2)"}}>Descripton:</p>
                </div>
                <div>
                    <p className="recipe-component" style={{display: "inline-block", width: "calc(50% - 22px)", margin: "10px"}}>Ingredients:</p>
                    <p className="recipe-component" style={{display: "inline-block", width: "calc(50% - 22px)", margin: "10px"}}>Instructions:</p>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;