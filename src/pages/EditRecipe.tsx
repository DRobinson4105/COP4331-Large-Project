import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../index.css";

const EditRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [protein, setProtein] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [calories, setCalories] = useState<number | ''>('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [tagId, setTagId] = useState<string>('');

  const baseUrl = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

  function buildPath(route: string): string {
    return baseUrl + "/api/" + route;
  }

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await fetch(buildPath(`recipe/get`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();

        if (data) {
          setTitle(data.name);
          setDescription(data.desc);
          setProtein(data.protein);
          setFat(data.fat);
          setCarbs(data.carbs);
          setCalories(data.calories);
          setIngredients(data.ingredients.join('\n'));
          setInstructions(data.instructions.join('\n'));
          setTagId(data.tagId.join(', '));
          setImage(data.image || null);
          setCurrentImage(data.image || null);
        }
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    };

    fetchRecipeData();
  }, [id]);

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
    interface UpdatedRecipe {
        id: string | undefined;
        name: string;
        desc: string;
        protein: number;
        fat: number;
        carbs: number;
        calories: number;
        ingredients: string[];
        instructions: string[];
        tagId: string[] | null;
        image: string | null;
        authorId: string;
    }

    const tagIds = tagId
        ? tagId.split(',').map(tag => tag.trim())
        : [];

    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const authorId = userData.id && /^[a-f\d]{24}$/i.test(userData.id) ? userData.id : '';

    if (!authorId) {
        console.error('Invalid author ID');
        return;
    }

    const updatedRecipe: UpdatedRecipe = {
        id,
        name: title,
        desc: description,
        protein: protein !== '' ? Number(protein) : 0,
        fat: fat !== '' ? Number(fat) : 0,
        carbs: carbs !== '' ? Number(carbs) : 0,
        calories: calories !== '' ? Number(calories) : 0,
        ingredients: ingredients.split('\n').map(item => item.trim()),
        instructions: instructions.split('\n').map(item => item.trim()),
        tagId: tagIds.length > 0 ? tagIds : null,
        image: image ? image.split(',')[1] : currentImage,
        authorId,
    };

    try {
        const response = await fetch(buildPath('recipe/update'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecipe),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${errorText}`);
            return;
        }

        // Navigate back to the ProfilePage after saving changes
        navigate(`/profilePage`);
    } catch (error: any) {
        console.error('Network Error:', error.message);
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
      <div className="ingredien ts-instructions-section">
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

export default EditRecipe;
