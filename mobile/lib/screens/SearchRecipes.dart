import 'package:flutter/material.dart';
import '../widgets/NavigationBar.dart';
import '../widgets/RecipeDisplay.dart';
import '../widgets/Filter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<dynamic>> fetchRecipes(String name, List<String> tagId, int minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/recipe/search'),
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
    return jsonDecode(response.body);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load recipes');
  }
}

class SearchRecipes extends StatefulWidget {
  const SearchRecipes(this.userId, {super.key});

  final String userId;

  @override
  State<SearchRecipes> createState() => SearchRecipesState(userId);
}

class SearchRecipesState extends State<SearchRecipes>{
  SearchRecipesState(this.userId);

  final String userId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        shrinkWrap: true,
        children: [
          ListTile(
            title: SearchBar(
              leading: const Icon(Icons.search),
              hintText: "Search Recipes",
            ),
          ),
          Filter(),
          FutureBuilder(
            future: fetchRecipes("", [], 0, 1e6, 0, 1e6, 0, 1e6, 0, 1e6),
            builder: (context, snapshot) {
              if(snapshot.hasData) {
                return RecipeDisplay(snapshot.data!);
              }
              else if(snapshot.hasError) {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text('${snapshot.error}'),
                  ],
                );
              }
              return Center(
                child: const CircularProgressIndicator(),
              );
            }, 
          ),
        ]
      ),
      bottomNavigationBar: NavBar(userId),
    );
  }
}