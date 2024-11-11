import RecipeImage from '../assets/Default Recipe Picture.png';
import { useState, useEffect } from 'react';

interface Props {
    name: String;
    description: String;
    image: string;  // Specifically lower case for image source
    //id: String;
}

const RecipeInfoCard = (props: Props) =>
{
    const [tags,setTags] = useState([]);
    const image = props.image || RecipeImage;

    return(
        <div className="recipe-info-card" style={{display: "flex"}}>
            <img src={image} style={{width: 150, height: 150, display: "inline-block", verticalAlign: "middle", marginRight: "10px"}} alt="Logo"/>
            <div style={{display: "inline-block"}}>
                <h3>{props.name}</h3>
                <p>{props.description}</p>
                <div style={{overflowX: "scroll"}}>{tags}</div>
            </div>
        </div>
   );
};

export default RecipeInfoCard;