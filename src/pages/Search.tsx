import React, { useEffect } from 'react';
import VerifiedNavBar from '../components/VerifiedNavBar';
import RecipeInfoCard from '../components/RecipeInfoCard'
import "../index.css";
import Filter from '../components/Filter';

const SearchPage: React.FC = () => {

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('background-color', '#FFFEEE');
  }, []);

  return (
    <div>
        <VerifiedNavBar />
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <input className="input" type="text" id="searchTerm" placeholder="Search by keyword" style={{display: 'inline-block', marginLeft: "10px", width: "calc(80% - 40px)"}}/>
            <input className="shortinput darkgreen button" type="submit" id="searchButton" value = "Search" style={{display: 'inline-block', marginRight: "10px", width: "20%"}} />
        </div>
        <Filter />
        <div className="recipeResults recipes" style={{verticalAlign: "top"}}>
            <RecipeInfoCard />
            <RecipeInfoCard />
            <RecipeInfoCard />
        </div>
    </div>
  );
};

export default SearchPage;