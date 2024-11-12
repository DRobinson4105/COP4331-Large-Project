import React, { useEffect, useState } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import RecipeInfoCard from '../components/RecipeInfoCard'
import "../index.css";
import Filter from '../components/Filter';

const SearchPage: React.FC = () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
      ? import.meta.env.VITE_API_URL
      : 'http://localhost:3000';

  function buildPath(route: string) : string {  
      return baseUrl + "/api/" + route;
  }

  const [recipes,setRecipes] = useState([<RecipeInfoCard name="Loading Recipes..." description="" image="" id="" tags={[<div></div>]} />]);
  const [search, setSearch] = useState('');
  const [addedTags,setAddedTags] = useState<string[]>([]);
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

    const initializeTags = async () => {
      var response = await fetch(
        buildPath('tag/search'),
        {method:'POST',body:JSON.stringify({ name: "" }),headers:{'Content-Type': 'application/json'}}
      );

      let res = JSON.parse(await response.text());

      setTags(res)
    }
    
    initializeTags();
  }, []);

  async function searchRecipes() : Promise<void> {
      var obj = {name:search, minCalories:minCalories, maxCalories:maxCalories, minProtein:minProtein, maxProtein:maxProtein, minFat:minFat, maxFat:maxFat, minCarbs:minCarbs, maxCarbs:maxCarbs, tagId:addedTags};

      try {
          var response = await fetch(
              buildPath('recipe/search'),
              {method:'POST',body:JSON.stringify(obj),headers:{'Content-Type': 'application/json'}}
          );

          let newRecipes = JSON.parse(await response.text());
          let searchResults = [];
          
          for(let i = 0; i < newRecipes.length; i++) {
             searchResults.push(<RecipeInfoCard name={newRecipes[i].name} description={newRecipes[i].desc} image={newRecipes[i].image} id={newRecipes[i].id} tags={newRecipes[i].tags}/>);
          }

          setRecipes(searchResults);

      } catch (error: any) {
          console.log("Couldn't complete search action", error);
          return;
      }
  }

  function handleSetSearch( e: any ) : void
  {
    setSearch( e.target.value );
  }

  return (
    <div>
        <VerifiedNavBar />
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <input className="input" type="text" id="searchTerm" placeholder="Search by keyword" onChange={handleSetSearch} style={{display: 'inline-block', marginLeft: "10px", width: "calc(80% - 40px)"}}/>
            <input className="shortinput darkgreen button" type="submit" id="searchButton" value = "Search" onClick={searchRecipes} style={{display: 'inline-block', marginRight: "10px", width: "20%"}} />
        </div>
        <Filter addedTags={addedTags} setAddedTags={setAddedTags} setMinCalories={setMinCalories} setMaxCalories={setMaxCalories} setMinProtein={setMinProtein} setMaxProtein={setMaxProtein} setMinFat={setMinFat} setMaxFat={setMaxFat} setMinCarbs={setMinCarbs} setMaxCarbs={setMaxCarbs} searchRecipes={searchRecipes} tags={tags}/>
        <div className="recipeResults recipes" style={{verticalAlign: "top"}}>{recipes}</div>
    </div>
  );
};

export default SearchPage;