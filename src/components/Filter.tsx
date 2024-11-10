import { useState } from 'react';
import DeleteIcon from "../assets/DeleteIcon.png"

function Filter()
{
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_API_URL
        : 'http://localhost:3000';

    function buildPath(route: string) : string {  
        return baseUrl + "/api/" + route;
    }

    const [tagSearchResults,setTagResults] = useState([<li style={{display: "none"}} key="-1"></li>]);
    const [addedTags,setAddedTags] = useState([<div key="-1"></div>]);

    async function removeTag(id:string) {
        let currentTags = addedTags;

        for(let i = 0; i < currentTags.length; i++) {
            if(id == currentTags[i].key)  {
                currentTags.splice(i, 1);
                setAddedTags(currentTags);
                return;
            }
        }
    }

    async function addTag(id:string, name:string) : Promise<void> {
        let currentTags = addedTags;

        for(let i = 0; i < currentTags.length; i++) {
            if(id == currentTags[i].key)  {
                return;
            }
        }

        currentTags.push(<div key={id} style={{display: "inline-block", width: "calc(90% + 15px)"}}>
                            <p style={{float: "left", margin: 0}}>{name}</p>
                            <img src={DeleteIcon} onClick={() => removeTag(id)} style={{width: "1.2em", height: "1.2em", float: "right", margin: 0}} alt="Delete Icon"/>
                        </div>);
        setAddedTags(currentTags);
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
            <input className="shortinput" type="text" id="searchTags" placeholder = "Search Tags" onChange={searchTag} style={{width: "calc(90% + 15px)", marginBottom: "5px"}}/>
            <ul style={{padding: 0, margin: 0, display: "block"}}>{tagSearchResults}</ul>
            <div style={{display: "block"}}>{addedTags}</div>
            <input className="shortinput darkgreen button" type="button" id="applyFilter" value = "Apply Filter" onClick={searchTag} style={{float: "right", marginRight: "20px"}}/>
        </div>
   );
};

export default Filter;