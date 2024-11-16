import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.css";

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}') 
  const userId = userData.id;

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [protein, setProtein] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [calories, setCalories] = useState<number | ''>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [tagId, setTagId] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null);
  console.log(error);
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

  const handleSaveRecipe = async () => {
    const ingredientsList = ingredients
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  
    const instructionsList = instructions
      ? instructions.split('\n').map(item => item.trim())
      : [];
  
    // Regex to check if a string is a valid ObjectID (24 hex characters)
    const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

    // Filter and include only valid ObjectIDs
    const tagIds = tagId
      ? tagId.split(',').map(tag => tag.trim()).filter(isValidObjectId)
      : [];

  
    const newRecipe = {
      name: title || '',
      desc: description || '',
      calories: calories !== '' ? Number(calories) : 0,
      fat: fat !== '' ? Number(fat) : 0,
      carbs: carbs !== '' ? Number(carbs) : 0,
      protein: protein !== '' ? Number(protein) : 0,
      authorId: userId,
      instructions: instructionsList,
      ingredients: ingredientsList,
      tagId: tagIds,
      image: image ? image.split(',')[1] : null,
    };
  
    console.log('Payload to API:', newRecipe);
    console.log('API URL:', buildPath('recipe/create'));
  
    try {
      const response = await fetch(buildPath('recipe/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        setError(`Error: ${errorText}`);
        return;
      }
  
      const data = await response.json();
  
      if (data && data.id) {
        navigate('/search');
      } else {
        setError(data.error || 'An error occurred while saving the recipe.');
      }
    } catch (error: any) {
      console.error('Network Error:', error.message);
      setError('Network error: Failed to fetch. Please check your connection or server status.');
    }
  };
  
  return (
    <div className="recipe-container">
      <div className="image-section">
        <img src={image || 'placeholder.jpg'} alt="Recipe" className="recipe-image" />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
        <div className="button-group">
          <button className="save-button" onClick={handleSaveRecipe}>Save Recipe</button>
        </div>
      </div>
      <div className="details-section">
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input title-input"
        />
        <input
          type="text"
          placeholder="Tag ID (e.g., vegan, gluten-free)"
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
          className="input tag-input"
        />
        <div className="nutrition-section">
          <div>Protein: <input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} /></div>
          <div>Fat: <input type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} /></div>
          <div>Carbs: <input type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} /></div>
          <div>Calories: <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} /></div>
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input description-input"
        />
      </div>
      <div className="ingredients-instructions-section">
        <textarea
          className="input ingredients-input"
          placeholder="List ingredients here"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <textarea
          className="input instructions-input"
          placeholder="List instructions here"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreateRecipe;