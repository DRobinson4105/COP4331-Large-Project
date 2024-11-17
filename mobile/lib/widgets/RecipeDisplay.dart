import 'package:flutter/material.dart';
import '../widgets/RecipeCard.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Recipe {
  final String recipeId;
  final String name;
  final String desc;
  final List<String> tagId;

  const Recipe ({
    required this.recipeId,
    required this.name,
    required this.desc,
    required this.tagId,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      recipeId: json["id"] == null ? "" : json["id"],
      name: json["name"] == null ? "" : json["name"],
      desc: json["desc"] == null ? "" : json["desc"],
      tagId: json["tagId"] == null ? [] : json["tagId"],
    );
  }
}

Future<List<Recipe>> fetchRecipes(String name, List<String> tagId, int minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/user/get'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, dynamic> {
      "name": name,
      "tagId": tagId,
      "minCalories": minCalories,
      "maxCalories": maxCalories,
      "minProtein": minProtein,
      "maxProtein": maxProtein,
      "minFat": minFat,
      "maxFat": maxFat,
      "minCarbs": minCarbs,
      "maxCarbs": maxCarbs,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    List<Recipe> recipes = [];
    for(int i = 0; i < response.body.length; i++) {
      recipes.add(Recipe.fromJson(jsonDecode(response.body[i]) as Map<String, dynamic>));
    }
    return recipes;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load profile');
  }
}

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