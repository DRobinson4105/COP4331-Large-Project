import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Recipe {
  final String name;
  final String desc;
  final int calories;
  final int fat;
  final int carbs;
  final int protein;
  final String authorId;
  final List<dynamic> instructions;
  final List<dynamic> ingredients;
  final List<dynamic> tagId;
  final String image;

  const Recipe ({
    required this.name,
    required this.desc,
    required this.calories,
    required this.fat,
    required this.carbs,
    required this.protein,
    required this.authorId,
    required this.instructions,
    required this.ingredients,
    required this.tagId,
    required this.image,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    print(json);
    return Recipe(
      name: json["name"] == null ? "" : json["name"],
      desc: json["desc"] == null ? "" : json["desc"],
      calories: json["calories"] == null ? 0 : json["calories"],
      fat: json["fat"] == null ? 0 : json["fat"],
      carbs: json["carbs"] == null ? 0 : json["carbs"],
      protein: json["protein"] == null ? 0 : json["protein"],
      authorId: json["authorId"] == null ? "" : json["authorId"],
      instructions: json["instructions"] == null ? [] : json["instructions"],
      ingredients: json["ingredients"] == null ? [] : json["ingredients"],
      tagId: json["tagId"] == null ? [] : json["tagId"],
      image: json["image"] == null || json["image"].split(",")[1] == "" ? "No Image" : json["image"].split(",")[1],
    );
  }
}

Future<String> fetchAuthor(String authorId) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/user/get'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String> {
      "id": authorId,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return jsonDecode(response.body)["name"] == null ? "Anonymous" : jsonDecode(response.body)["name"];
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load profile');
  }
}

Future<Recipe> fetchRecipe(String id) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/recipe/get'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String> {
      "id": id,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Recipe.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load recipe');
  }
}

class RecipePage extends StatefulWidget {
  const RecipePage(this.recipeId, {super.key});

  final String recipeId;

  @override
  State<RecipePage> createState() => RecipePageState(recipeId);
}

class RecipePageState extends State<RecipePage> {
  RecipePageState(this.recipeId);

  final String recipeId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: FutureBuilder(
        future: fetchRecipe(recipeId), 
        builder: (context, snapshot) {
          if(snapshot.hasData) {
            return ListView(
              shrinkWrap: true,
              children: [
                if(snapshot.data!.image != "No Image")
                  Image(
                    image: ResizeImage(MemoryImage(base64Decode(snapshot.data!.image)), width: 300, height: 300),
                    errorBuilder: (context, error, stackTrace) {
                      return Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100));
                    },
                  ),
                if(snapshot.data!.image == "No Image") 
                  Image(image: ResizeImage(AssetImage('lib/assets/DefaultPFP.png'), width: 300, height: 300)),
                ListTile(
                  title: Column(
                    children: [
                      Text(snapshot.data!.name, style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),),
                      FutureBuilder(
                        future: fetchAuthor(snapshot.data!.authorId),
                        builder: (context, snapshot) {
                          if(snapshot.hasData) {
                            return Text("By " + snapshot.data!, style: TextStyle(fontSize: 20),);
                          }
                          else if(snapshot.hasError) {
                            return Text("By Anonymous", style: TextStyle(fontSize: 20),);
                          }
                          
                          return const CircularProgressIndicator();
                        },
                      ),
                    ],
                  )
                  
                ),
                ListTile(
                  title: Column(
                    children: [
                      Text("Calories: " + snapshot.data!.calories.toString()),
                      Text("Protein: " + snapshot.data!.protein.toString()),
                      Text("Fat: " + snapshot.data!.fat.toString()),
                      Text("Carbs: " + snapshot.data!.carbs.toString()),
                    ],
                  )
                ),
                ExpansionTile(
                  title: Text("Description"),
                  children: [
                    ListTile(
                      title: Text(snapshot.data!.desc),
                    ),
                  ],
                ),
                ExpansionTile(
                  title: Text("Ingredients"),
                  children: [
                    ListTile(
                      title: Column(
                        children: snapshot.data!.ingredients.map<Text>((ingredient) {
                          return Text(ingredient);
                        }).toList(),
                      ),
                    ),
                  ],
                ),
                ExpansionTile(
                  title: Text("Instructions"),
                  children: [
                    ListTile(
                      title: Column(
                        children: snapshot.data!.instructions.map<Text>((ingredient) {
                          return Text(ingredient);
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ],
            );
          }

          else if(snapshot.hasError) {
            return Center(
              child: Text('${snapshot.error}'),
            );
          }

          return Center(
            child: const CircularProgressIndicator(),
          );
        }
      )
    );
  }
}