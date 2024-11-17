import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VerifiedNavBar from '../components/VerifiedNavBar';
import RecipeInfoCard from '../components/RecipeInfoCard';
import "../index.css";
import Filter from '../components/Filter';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

  function buildPath(route: string): string {
    return baseUrl + "/api/" + route;
  }

  const [recipes, setRecipes] = useState([
    <RecipeInfoCard name="Loading Recipes..." description="" image="" id="" tags={[]} />
  ]);
  const [search, setSearch] = useState('');
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(1e6);
  const [minProtein, setMinProtein] = useState(0);
  const [maxProtein, setMaxProtein] = useState(1e6);
  const [minFat, setMinFat] = useState(0);
  const [maxFat, setMaxFat] = useState(1e6);
  const [minCarbs, setMinCarbs] = useState(0);
  const [maxCarbs, setMaxCarbs] = useState(1e6);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');
    searchRecipes();
    initializeTags();

    // Fetch initial recipes and tags
    searchRecipes();
    initializeTags();

    // Refresh the recipes if coming back from the CreateRecipe page
    if (location.state?.refresh) {
      searchRecipes();
    }
  }, [location.state]);

  async function initializeTags() {
    const response = await fetch(
      buildPath('tag/search'),
      {
        method: 'POST',
        body: JSON.stringify({ name: "" }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const res = JSON.parse(await response.text());
    setTags(res);
  }

  async function searchRecipes(): Promise<void> {
    const obj = {
      name: search,
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      minFat,
      maxFat,
      minCarbs,
      maxCarbs,
      tagId: addedTags
    };

    try {
      const response = await fetch(
        buildPath('recipe/search'),
        {
          method: 'POST',
          body: JSON.stringify(obj),
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const newRecipes = JSON.parse(await response.text());
      const searchResults = newRecipes.map((recipe: any) => (
        <RecipeInfoCard
          key={recipe.id}
          name={recipe.name}
          description={recipe.desc}
          image={recipe.image}
          id={recipe.id}
          tags={recipe.tagId}
        />
      ));

      setRecipes(searchResults);
    } catch (error) {
      console.error("Couldn't complete search action:", error);
    }
  }

  function handleSetSearch(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearch(e.target.value);
  }

  function handleCreateRecipe(): void {
    navigate('/createRecipe');
  }

  return (
    <div>
      <VerifiedNavBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <input
          className="input"
          type="text"
          id="searchTerm"
          placeholder="Search by keyword"
          onChange={handleSetSearch}
          style={{ display: 'inline-block', marginLeft: "10px", width: "calc(70% - 40px)" }}
        />
        <input
          className="shortinput darkgreen button"
          type="submit"
          id="searchButton"
          value="Search"
          onClick={searchRecipes}
          style={{ display: 'inline-block', marginRight: "10px", width: "20%" }}
        />
        <button
          className="create-recipe-button darkgreen button"
          onClick={handleCreateRecipe}
          style={{ display: 'inline-block', marginRight: "10px" }}
        >
          Create Recipe
        </button>
      </div>
      <Filter
        addedTags={addedTags}
        setAddedTags={setAddedTags}
        setMinCalories={setMinCalories}
        setMaxCalories={setMaxCalories}
        setMinProtein={setMinProtein}
        setMaxProtein={setMaxProtein}
        setMinFat={setMinFat}
        setMaxFat={setMaxFat}
        setMinCarbs={setMinCarbs}
        setMaxCarbs={setMaxCarbs}
        searchRecipes={searchRecipes}
        tags={tags}
      />
      <div className="recipeResults recipes" style={{ verticalAlign: "top" }}>
        {recipes}
      </div>
    </div>
  );
};

export default SearchPage;
