import TagFilter from './TagFilter';

interface Props {
    addedTags: string[];
    setAddedTags: (addedTags:string[]) => void;
    setMinCalories: (minCalories:number) => void;
    setMaxCalories: (maxCalories:number) => void;
    setMinProtein: (minProtein:number) => void;
    setMaxProtein: (maxProtein:number) => void;
    setMinFat: (minFat:number) => void;
    setMaxFat: (maxFat:number) => void;
    setMinCarbs: (minCarbs:number) => void;
    setMaxCarbs: (maxCarbs:number) => void;
    searchRecipes: () => Promise<void>;
    tags: string[];
}

const Filter = (props: Props) =>
{
    function handleSetMinCalories(e:any) : void {
        props.setMinCalories(isNaN(Number(e.target.value)) || e.target.value == "" ? 0 : Number(e.target.value));
    }

    function handleSetMaxCalories(e:any) : void {
        props.setMaxCalories(isNaN(Number(e.target.value)) || e.target.value == "" ? 1e6 : Number(e.target.value));
    }

    function handleSetMinProtein(e:any) : void {
        props.setMinProtein(isNaN(Number(e.target.value)) || e.target.value == "" ? 0 : Number(e.target.value));

    }

    function handleSetMaxProtein(e:any) : void {
        props.setMaxProtein(isNaN(Number(e.target.value)) || e.target.value == "" ? 1e6 : Number(e.target.value));

    }

    function handleSetMinFat(e:any) : void {
        props.setMinFat(isNaN(Number(e.target.value)) || e.target.value == "" ? 0 : Number(e.target.value));

    }

    function handleSetMaxFat(e:any) : void {
        props.setMaxFat(isNaN(Number(e.target.value)) || e.target.value == "" ? 1e6 : Number(e.target.value));

    }

    function handleSetMinCarbs(e:any) : void {
        props.setMinCarbs(isNaN(Number(e.target.value)) || e.target.value == "" ? 0 : Number(e.target.value));

    }

    function handleSetMaxCarbs(e:any) : void {
        props.setMaxCarbs(isNaN(Number(e.target.value)) || e.target.value == "" ? 1e6 : Number(e.target.value));

    }

   return(
        <div className="recipe-info-card filter">
            <h2>Filter</h2>
            <a>Calories</a>
            <div>
                <input className="shortinput" type="text" id="minCalories" placeholder = "Min" onChange={handleSetMinCalories} style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxCalories" placeholder = "Max" onChange={handleSetMaxCalories} />
            </div>
            <a>Protein</a>
            <div>
                <input className="shortinput" type="text" id="minProtein" placeholder = "Min" onChange={handleSetMinProtein} style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxProtein" placeholder = "Max" onChange={handleSetMaxProtein} />
            </div>
            <a>Fat</a>
            <div>
                <input className="shortinput" type="text" id="minFat" placeholder = "Min" onChange={handleSetMinFat} style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxFat" placeholder = "Max" onChange={handleSetMaxFat} />
            </div>
            <a>Carbs</a>
            <div>
                <input className="shortinput" type="text" id="minCarbs" placeholder = "Min" onChange={handleSetMaxCarbs} style={{marginRight: "10px"}} />
                <input className="shortinput" type="text" id="maxCarbs" placeholder = "Max" onChange={handleSetMinCarbs} />
            </div>
            <TagFilter tags={props.tags} setSelectedTags={props.setAddedTags} />
            <input className="shortinput darkgreen button" type="button" id="applyFilter" value = "Apply Filter" onClick={props.searchRecipes} style={{float: "right"}}/>
        </div>
   );
};

export default Filter;