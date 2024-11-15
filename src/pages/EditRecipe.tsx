import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../index.css";

const EditRecipe: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  const [title, setTitle] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.desc || '');
  const [image, setImage] = useState(recipe?.image || null);
  const [tagId, setTagId] = useState(recipe?.tagId.join(', ') || '');
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

  function buildPath(route: string): string {
    return baseUrl + "/api/" + route;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateRecipe = async () => {
    const updatedRecipe = {
      id: recipe.id,
      name: title,
      desc: description,
      image: image ? image.split(',')[1] : recipe.image,
      tagId: tagId.split(',').map(tag => tag.trim())
    };

    try {
      const response = await fetch(buildPath('recipe/update'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        setError(`Error: ${errorText}`);
        return;
      }

      const data = await response.json();

      if (data && data.success) {
        navigate('/profile');
      } else {
        setError(data.error || 'An error occurred while updating the recipe.');
      }
    } catch (error: any) {
      console.error('Network Error:', error.message);
      setError('Network error: Failed to fetch. Please check your connection or server status.');
    }
  };

  return (
    <div className="edit-recipe-container">
      <h2>Edit Recipe</h2>
      <div className="image-section">
        <img src={image || 'placeholder.jpg'} alt="Recipe" className="recipe-image" />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
      </div>
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input title-input"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input description-input"
      />
      <input
        type="text"
        placeholder="Tag ID (comma-separated)"
        value={tagId}
        onChange={(e) => setTagId(e.target.value)}
        className="input tag-input"
      />
      <button
        className="save-button"
        onClick={handleUpdateRecipe}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Save Changes
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EditRecipe;
