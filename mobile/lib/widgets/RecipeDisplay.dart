import 'package:flutter/material.dart';
import '../widgets/RecipeCard.dart';

class RecipeDisplay extends StatefulWidget {
  const RecipeDisplay(this.recipes, {super.key});

  final List<dynamic> recipes;

  @override
  State<RecipeDisplay> createState() => RecipeDisplayState();
}

class RecipeDisplayState extends State<RecipeDisplay> {
    @override
    Widget build(BuildContext context) {
        return Container(
            color: const Color(0xFF8ED081),
            child: Column(
              children: widget.recipes.map((recipe) {
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