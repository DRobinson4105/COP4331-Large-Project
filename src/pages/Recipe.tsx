import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import "../index.css";
import RecipeImage from '../assets/Default Recipe Picture.png'

const RecipePage: React.FC = () => {

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('background-color', '#FFFEEE');
    }, []);

    return (
        <div>
            <NavBar />
            <div className="recipe-component">
                <div style={{display: "flex"}}>
                    <img src={RecipeImage} style={{width: 215, height: 215, display: "inline-block", verticalAlign: "middle", margin: "10px", border: "1px solid black"}} alt="Logo"/>
                    <div style={{display: "inline-block", verticalAlign: "middle", marginRight: "10px", width: "calc((100% - 244px) / 2)"}}>
                        <p className="recipe-component">Bonnie's Ultimate Burger</p>
                        <p className="recipe-component">Author: Bonnie the Bunny</p>
                        <div className="recipe-component">
                            <p>Protein: 34g</p>
                            <p>Calories: 540 calories</p>
                            <p>Fat: 27g</p>
                            <p>Carbs: 40g</p>
                        </div>
                    </div>
                    <div className="recipe-component" style={{verticalAlign: "top", width: "calc((100% - 244px) / 2)", padding: "10px", height: "195px", overflowY: "scroll"}}>
                        <p style={{margin: "10px 0px"}}>Description:</p>
                        <p>As a lead guitarist, it should be no surprise to see Bonnie leading the way with instructions on making the ultimate burger. If you top it with the crispy coated onions, you'll be striking all the right chords once again!</p>
                    </div>
                </div>
                <div>
                    <div className="recipe-component" style={{display: "inline-block", verticalAlign: "top", width: "calc(50% - 32px)"}}>
                        <p style={{margin: "10px"}}>Ingredients:</p>
                        <p style={{margin: "25px"}}>
                            For the burger:
                            <ul>
                                <li>2 patties</li>
                                <li>2 burger buns</li>
                                <li>2 slices of cheese</li>
                                <li>Lettuce of your choice</li>
                                <li>2 slices of tomato</li>
                                <li>Sliced pickles</li>
                            </ul>
                            For the onions:
                            <ul>
                                <li>1 small onion, thinly sliced</li>
                                <li>3 tbsp buttermilk</li>
                                <li>5/6 cup vegtable oil</li>
                                <li>2 tbsp all-purpose flour</li>
                                <li>1 tsp paprika</li>
                                <li>Salt and black pepper</li>
                            </ul>
                            For the burger sauce:
                            <ul>
                                <li>
                                    2 tbsp mayonnaise
                                    1 tsp ketchup
                                    1 gherkin, finely chopped
                                    1 tsp yellow mustard
                                    1 tbsp finely chopped chives
                                </li>
                            </ul>
                        </p>
                    </div>
                    <div className="recipe-component" style={{display: "inline-block", verticalAlign: "top", width: "calc(50% - 32px)"}}>
                        <p style={{margin: "10px"}}>Instructions:</p>
                        <ol style={{margin: "25px"}}>
                            <li>Place the sliced onions into a bowl with the buttermilk and leave them to soak until you are ready to fry.</li>
                            <li>For the burger sauce, combine the ingredients in a small bowl and set to one side.</li>
                            <li>To fry the onions, heat the vegetable oil in a small saucepan or frying pan over medium heat</li>
                            <li>Place the flour into another bowl, add the paprikam and season with salt and black pepper.</li>
                            <li>To test that the oil is hot enough, dip 1 or 2 pieces of onion into the flour and place into the oil. The oil is hot enough if the onion gets crispy after about a minute.</li>
                            <li>Fry the onions in batches until golden and crisp. Drain on paper towels.</li>
                            <li>To cook the burgers, heat a frying pan or griddle to medium-high heat</li>
                            <li>Place the open buns facedown in the pan and toast until lightly browned</li>
                            <li>Brush the patties with vegetable oil and cook for about 3-4 minutes. Flip the patties and add the cheese. Continue cooking for 3-4 minutes.</li>
                            <li>Now you are ready to build the ultimate burger. Spread the bun with some burger sauce. Add lettuce, tomato, the cheeseburger, pickles (if using), a generous amount of crispy onions, more burger sauce, and finally the top bun. Sit back and enjoy</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;