import 'package:flutter/material.dart';
import '../widgets/RecipeCard.dart';

class RecipeDisplay extends StatefulWidget {
  const RecipeDisplay(this.recipes, {super.key});

  final List<dynamic> recipes;

  @override
  State<RecipeDisplay> createState() => RecipeDisplayState(recipes);
}

class RecipeDisplayState extends State<RecipeDisplay> {
    RecipeDisplayState(this.recipes);

    final List<dynamic> recipes;

    @override
    Widget build(BuildContext context) {
        return Container(
            padding: EdgeInsets.symmetric(vertical: 10),
            color: const Color(0xFF8ED081),
            child: Column(
              children: recipes.map((recipe) {
                return RecipeCard(
                  recipe["id"],
                  recipe["name"], 
                  recipe["desc"] == null ? "" : recipe["desc"], 
                  recipe["image"] == null || recipe["image"].split(",")[1] == "" ? "No Image" : recipe["image"].split(",")[1], 
                  recipe["tagId"]
                );
              }).toList(),
            ),
        );
    }
}