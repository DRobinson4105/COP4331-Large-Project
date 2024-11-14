import RecipeImage from '../assets/Default Recipe Picture.png';
import { Link } from 'react-router-dom';

interface Props {
    name: String;
    description: String;
    image: string;  // Specifically lower case for image source
    id: String;
    tags: String[];
}

const RecipeInfoCard = (props: Props) =>
{
    const image = props.image || RecipeImage;
    console.log(props.tags)

    return(
        <div className="recipe-info-card" style={{display: "flex"}}>
            <img src={image} style={{width: 150, height: 150, display: "inline-block", verticalAlign: "middle", marginRight: "10px"}} alt="Logo"/>
            <div style={{display: "inline-block"}}>
                <Link to={"/" + props.id}><h3>{props.name}</h3></Link>
                <p>{props.description}</p>
                <div style={{overflowX: "scroll"}}>
                    {props.tags.map((tag) => (
                        <a className="tag">{tag}</a>
                    ))}
                </div>
            </div>
        </div>
   );
};

export default RecipeInfoCard;