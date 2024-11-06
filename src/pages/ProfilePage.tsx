import React, { useEffect } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import "../index.css";

const recipes = [
  {
    name: 'Steak',
    image: 'path_to_image', // replace with actual image path or URL
    tags: ['Meal Prep', 'Low Calorie', 'Beef'],
    calories: 1000,
    protein: '5g',
    fat: '250mg',
    carbs: '20mg'
  },
  {
    name: 'Grilled Chicken',
    image: 'path_to_image', // replace with actual image path or URL
    tags: ['High Protein', 'Low Fat', 'Chicken'],
    calories: 800,
    protein: '35g',
    fat: '10mg',
    carbs: '5mg'
  },
  // Add more recipes here
];

const ProfilePage: React.FC = () => {

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');
  }, []);

  return (
    <div className="profile-page">
      <VerifiedNavBar /> 
      
      <div className="profile-container">
        <div className="sidebar">
          <div className="avatar-placeholder"></div>
          <div className="display-name">Display name</div>
          <div className="description">Description</div>
        </div>
        
        <div className="recipes-section">
          <h2 className="recipes-title">Name’s Recipes</h2>
          <div className="recipes-grid">
            {recipes.map((recipe, index) => (
              <div className="recipe-card" key={index}>
                <img className="recipe-image" src={recipe.image} alt={recipe.name} />
                <div className="recipe-info">
                  <h3 className="recipe-name">{recipe.name}</h3>
                  <div className="tags">
                    <span>Tags:</span>
                    <ul>
                      {recipe.tags.map((tag, idx) => (
                        <li key={idx}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="nutrition">
                    <p>{recipe.calories} Calories</p>
                    <p>{recipe.protein} Protein</p>
                    <p>{recipe.fat} Fat</p>
                    <p>{recipe.carbs} Carbs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
