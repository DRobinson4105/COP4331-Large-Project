import { useState} from 'react';
import DeleteIcon from "../assets/DeleteIcon.png"

interface Props {
    addedTags: JSX.Element[];
    setAddedTags: (addedTags:JSX.Element[]) => void;
    setMinCalories: (minCalories:number) => void;
    setMaxCalories: (maxCalories:number) => void;
    setMinProtein: (minProtein:number) => void;
    setMaxProtein: (maxProtein:number) => void;
    setMinFat: (minFat:number) => void;
    setMaxFat: (maxFat:number) => void;
    setMinCarbs: (minCarbs:number) => void;
    setMaxCarbs: (maxCarbs:number) => void;
    searchRecipes: () => Promise<void>;
}

const Filter = (props: Props) =>
{
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [tagSearchResults,setTagResults] = useState([<li style={{display: "none"}} key="-1"></li>]);

    async function removeTag(id:string) {
        let currentTags = props.addedTags;

        for(let i = 0; i < currentTags.length; i++) {
            if(id == currentTags[i].key)  {
                currentTags.splice(i, 1);
                props.setAddedTags(currentTags);
                return;
            }
        }
    }

    async function addTag(id:string, name:string) : Promise<void> {
        let currentTags = props.addedTags;

        for(let i = 0; i < currentTags.length; i++) {
            if(id == currentTags[i].key)  {
                return;
            }
        }

        currentTags.push(<div key={id} style={{display: "inline-block", width: "calc(90% + 15px)"}}>
                            <p style={{float: "left", margin: 0}}>{name}</p>
                            <img src={DeleteIcon} onClick={() => removeTag(id)} style={{width: "1.2em", height: "1.2em", float: "right", margin: 0}} alt="Delete Icon"/>
                        </div>);
        props.setAddedTags(currentTags);
    };   

    async function searchTag(e:any) : Promise<void>
    {
        e.preventDefault();

        if(String(e.target.value).length == 0) {
            setTagResults([]);
            return;
        }
        
        let obj = {name:e.target.value};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath("tag/search"),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let newTagList = [{"id": "", "name": ""}];
            newTagList = JSON.parse(txt);
            let currTagList;

            currTagList = newTagList.map((tag) => {
                return <input type='button' value={tag.name} key={tag.id} style={{display: "block", width: "calc(90% + 20px)", textAlign: "left", marginTop: 0, border: "1px solid black"}} onClick={() => addTag(tag.id, tag.name)}></input>
            });

            setTagResults(currTagList);
        }
        catch(error:any)
        {
            console.log('SearchTag Failed:', error)
        }
    };

    function handleSetMinCalories(e:any) : void {
        props.setMinCalories(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
    }

    function handleSetMaxCalories(e:any) : void {
        props.setMaxCalories(e.target.value);
    }

    function handleSetMinProtein(e:any) : void {
        props.setMinProtein(e.target.value);
    }

    function handleSetMaxProtein(e:any) : void {
        props.setMaxProtein(e.target.value);
    }

    function handleSetMinFat(e:any) : void {
        props.setMinFat(e.target.value);
    }

    function handleSetMaxFat(e:any) : void {
        props.setMaxFat(e.target.value);
    }

    function handleSetMinCarbs(e:any) : void {
        props.setMinCarbs(e.target.value);
    }

    function handleSetMaxCarbs(e:any) : void {
        props.setMaxCarbs(e.target.value);
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
            <a style={{display: "block"}}>Tags</a>
            <input className="shortinput" type="text" id="searchTags" placeholder = "Search Tags" onChange={searchTag} style={{width: "calc(90% + 15px)", marginBottom: "5px"}}/>
            <ul style={{padding: 0, margin: 0, display: "block"}}>{tagSearchResults}</ul>
            <div style={{display: "block"}}>{props.addedTags}</div>
            <input className="shortinput darkgreen button" type="button" id="applyFilter" value = "Apply Filter" onClick={props.searchRecipes} style={{float: "right", marginRight: "20px"}}/>
        </div>
   );
};

export default Filter;