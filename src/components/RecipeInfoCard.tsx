import RecipeImage from '../assets/Default Recipe Picture.png'

function RecipeInfoCard()
{
   return(
        <div className="recipe-info-card" style={{display: "flex"}}>
            <img src={RecipeImage} style={{width: 150, height: 150, display: "inline-block", verticalAlign: "middle", marginRight: "10px"}} alt="Logo"/>
            <div style={{display: "inline-block"}}>
                <h3>Homemade Stew</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut lab</p>
                <div style={{overflowX: "scroll"}}>
                    <a className="tag">Vegan</a>
                    <a className="tag">Meal Prep</a>
                    <a className="tag">Low Calorie</a>
                    <a className="tag">Family Meal</a>
                    <a className="tag">Short Prep Time</a>
            </div>
            </div>
        </div>
   );
};

export default RecipeInfoCard;