import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifiedNavBar from '../components/VerifiedNavBar';
import Description from '../components/Description';
import "../index.css";
import { Link } from 'react-router-dom';

const baseUrl = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://nomnom.network:3000';

function buildPath(route: string): string {
    return baseUrl + "/api/" + route;
}

interface Recipe {
    id: string;
    name: string;
    image: string;
    desc: string;
    tagId: string[];
}

interface UserData {
    name: string;
    description: string;
    image: string;
    recipes: Recipe[];
}

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        description: '',
        image: '',
        recipes: []
    });
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#FFFEEE');

        const fetchUserData = async () => {
            const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;

            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }

            const obj = { id: userId };
            const js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('user/get'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                console.log('API Response:', data);

                if (!data.error) {
                    setUserData({
                        name: data.name || 'No Name Provided',
                        description: data.desc || 'No Description Available',
                        image: data.image || '',
                        recipes: data.recipes || []
                    });
                } else {
                    console.error('Error fetching user data:', data.error);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Function to navigate to EditRecipe page
    const goToEditRecipe = (recipe: Recipe) => {
        navigate(`/edit-recipe/${recipe.id}`, { state: { recipe } });
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this recipe?");

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(buildPath('recipe/delete'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: recipeId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error: ${errorText}`);
                return;
            }

            setUserData((prevState) => ({
                ...prevState,
                recipes: prevState.recipes.filter((recipe) => recipe.id !== recipeId),
            }));

            setError(null);
            alert("Recipe successfully deleted.");
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Failed to delete recipe.');
        }
    };

    return (
        <div className="profile-page">
            <VerifiedNavBar />

            <div className="profile-container">
                {/* Sidebar Section */}
                <div className="sidebar">
                    <div className="avatar-placeholder">
                        <img
                            src={userData.image || '/noPFP.png'}
                            alt={`${userData.name}'s avatar`}
                            className="profile-avatar"
                        />
                    </div>
                    <div className="display-name">{userData.name}</div>
                    <Description description={userData.description} />
                </div>

                {/* Main Content Section */}
                <div className="main-content">
                    <div className="recipes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="recipes-title">
                            {userData.name ? `${userData.name}’s Recipes` : 'User’s Recipes'}
                        </h2>
                        <button
                        className="settings-button"
                        onClick={() => navigate('/ProfileSettings')}
                        >
                        Profile Settings
                        </button>

                    </div>

                    {/* Recipes Section */}
                    <div className="recipes-section">
                        <div className="recipes-grid">
                            {userData.recipes.map((recipe) => (
                                <div className="recipe-card" key={recipe.id}>
                                    <img className="recipe-image" src={recipe.image || './Default_Recipe_Picture.png'} alt={recipe.name} />
                                    <div className="recipe-info">
                                        <Link to={"/" + recipe.id}><h3 className="recipe-name">{recipe.name}</h3></Link>
                                        <div className="tags">
                                            <span>Tags:</span>
                                            <ul>
                                                {recipe.tagId.map((tag, idx) => (
                                                    <li key={idx}>{tag}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="nutrition">
                                            <p>{recipe.desc}</p>
                                        </div>
                                        {/* Edit Recipe Button */}
                                        <button
                                            className="edit-recipe-button"
                                            onClick={() => goToEditRecipe(recipe)}
                                        >
                                            Edit Recipe
                                        </button>
                                        {/* Delete Recipe Button */}
                                        <button
                                            className="delete-recipe-button"
                                            onClick={() => handleDeleteRecipe(recipe.id)}
                                        >
                                            Delete Recipe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
