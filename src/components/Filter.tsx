function Filter()
{
   return(
        <div className="recipe-info-card filter">
            <h2>Filter</h2>
            <a>Calories</a>
            <div>
                <input className="shortinput" type="text" id="minCalories" placeholder = "Min" style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxCalories" placeholder = "Max" />
            </div>
            <a>Protein</a>
            <div>
                <input className="shortinput" type="text" id="minProtein" placeholder = "Min" style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxProtein" placeholder = "Max" />
            </div>
            <a>Fat</a>
            <div>
                <input className="shortinput" type="text" id="minFat" placeholder = "Min" style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxFat" placeholder = "Max" />
            </div>
            <a>Carbs</a>
            <div>
                <input className="shortinput" type="text" id="minCarbs" placeholder = "Min" style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxCarbs" placeholder = "Max" />
            </div>
            <a style={{display: "block"}}>Tags</a>
            <input className="shortinput" type="text" id="searchTags" placeholder = "Search Tags" style={{width: "calc(90% + 15px)"}}/>
            <input className="shortinput darkgreen button" type="button" id="applyFilter" value = "Apply Filter" style={{float: "right", marginRight: "20px"}}/>
        </div>
   );
};

export default Filter;