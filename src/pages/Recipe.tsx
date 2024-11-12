import React, { useEffect, useState } from 'react';
import "../index.css";
import RecipeImage from '../assets/Default Recipe Picture.png'
import { useParams } from 'react-router-dom';
import VerifiedNavBar from '../components/VerifiedNavBar';

const RecipePage: React.FC = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('Title');
    const [author, setAuthor] = useState('Anonymous');
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(RecipeImage);
    const [tags, setTags] = useState(['']);

    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#FFFEEE');

        const fetchRecipe = async() => {
            var obj = {id: id};

            try {
                var response = await fetch(
                    buildPath('recipe/get'),
                    {method:'POST',body:JSON.stringify(obj),headers:{'Content-Type': 'application/json'}}
                );
                
                let recipeInfo = JSON.parse(await response.text());
                console.log(recipeInfo);

                setTitle(recipeInfo.name);
                setCalories(recipeInfo.calories);
                setProtein(recipeInfo.protein);
                setFat(recipeInfo.fat);
                setCarbs(recipeInfo.carbs);
                setDescription(recipeInfo.desc);
                setIngredients(recipeInfo.ingredients);
                setInstructions(recipeInfo.instructions);
                setTags(recipeInfo.tagId);

                if(recipeInfo.image != undefined) {
                    setImage(recipeInfo.image);
                }

                obj = {id: recipeInfo.authorId}

                response = await fetch(
                    buildPath('user/get'),
                    {method:'POST',body:JSON.stringify(obj),headers:{'Content-Type': 'application/json'}}
                );

                if(response.status != 409) {
                    let author = JSON.parse(await response.text());
                    setAuthor(author.name);
                }
            } catch (error: any) {
                window.location.href = '/Search';
            }
        };

        fetchRecipe();
    }, []);

    return (
        <div>
            <VerifiedNavBar />
            <div className="recipe-component">
                <div style={{display: "flex"}}>
                    <img src={image} style={{width: 215, height: 215, display: "inline-block", verticalAlign: "middle", margin: "10px", border: "1px solid black"}} alt="Logo"/>
                    <div style={{display: "inline-block", verticalAlign: "middle", marginRight: "10px", width: "calc((100% - 244px) / 2)"}}>
                        <p className="recipe-component">{title}</p>
                        <p className="recipe-component">By {author}</p>
                        <div className="recipe-component">
                            <p>Protein: {protein}</p>
                            <p>Calories: {calories}</p>
                            <p>Fat: {fat}</p>
                            <p>Carbs: {carbs}</p>
                        </div>
                    </div>
                    <div className="recipe-component" style={{verticalAlign: "top", width: "calc((100% - 244px) / 2)", padding: "10px", height: "195px", overflowY: "scroll"}}>
                        <p style={{margin: "10px 0px"}}>Description:</p>
                        <p>{description}</p>
                    </div>
                </div>
                <div style={{display: "block", marginLeft: "10px"}}>
                    {tags.map((tag) => (
                        <a className="tag">{tag}</a>
                    ))}
                </div>
                <div>
                    <div className="recipe-component" style={{display: "inline-block", verticalAlign: "top", width: "calc(50% - 32px)"}}>
                        <p style={{margin: "10px"}}>Ingredients:</p>
                        <p style={{margin: "25px"}}>{ingredients}</p>
                    </div>
                    <div className="recipe-component" style={{display: "inline-block", verticalAlign: "top", width: "calc(50% - 32px)"}}>
                        <p style={{margin: "10px"}}>Instructions:</p>
                        <p style={{margin: "25px"}}>{instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;