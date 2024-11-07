import React, { useEffect, useState } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import Description from '../components/Description';
import "../index.css";

const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://nomnom.network:3000';

function buildPath(route: string) : string {  
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

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');

    const fetchUserData = async () => {
      const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;

      console.log('Retrieved userId from local storage:', userId);

      if (!userId) {
        console.error('No user ID found in local storage');
        return;
      }

      let obj = {id: userId};
      let js = JSON.stringify(obj);

      try {
        const response = await fetch(buildPath('user/get'), {
          method: 'POST',
          body: js,
          headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        console.log('API Response:', data); 

        if (!data.error) {
          setUserData({
            name: data.name || 'No Name Provided',
            description: data.desc || 'No Description Available',
            image: data.image || 'default_image_path',
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

  return (
    <div className="profile-page">
      <VerifiedNavBar />

      <div className="profile-container">
        {/* Sidebar Section */}
        <div className="sidebar">
          <div className="avatar-placeholder">
            <img src={userData.image} alt={`${userData.name}'s avatar`} />
          </div>
          <div className="display-name">{userData.name}</div>
          <Description description={userData.description} />
        </div>

        <div className="main-content">
          <h2 className="recipes-title">
            {userData.name ? `${userData.name}’s Recipes` : 'User’s Recipes'}
          </h2>

          {/* Recipes Section */}
          <div className="recipes-section">
            <div className="recipes-grid">
              {userData.recipes.map((recipe) => (
                <div className="recipe-card" key={recipe.id}>
                  <img className="recipe-image" src={recipe.image} alt={recipe.name} />
                  <div className="recipe-info">
                    <h3 className="recipe-name">{recipe.name}</h3>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
