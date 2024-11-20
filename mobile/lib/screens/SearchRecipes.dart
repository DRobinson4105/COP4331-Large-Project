import 'dart:async';
import 'package:flutter/material.dart';
import '../widgets/NavigationBar.dart';
import '../widgets/RecipeDisplay.dart';
import '../widgets/Filter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchRecipes extends StatefulWidget {
  const SearchRecipes(this.userId, {super.key});

  final String userId;

  @override
  State<SearchRecipes> createState() => SearchRecipesState(userId);
}

class SearchRecipesState extends State<SearchRecipes>{
  SearchRecipesState(this.userId);

  final String userId;
  StreamController recipeController = StreamController.broadcast();

  String name = "";
  List<dynamic> tagId = [];
  int minCalories = 0;
  int maxCalories = 1000000;
  int minProtein = 0;
  int maxProtein = 1000000;
  int minFat = 0;
  int maxFat = 1000000;
  int minCarbs = 0;
  int maxCarbs = 1000000;

  Future fetchRecipes(String name, List<dynamic> tagId, int minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs) async {
    print(name);
    print(tagId);
    print(minCalories);
    print(maxCalories);
    print(minProtein);
    print(maxProtein);
    print(minFat);
    print(maxFat);
    print(minCarbs);
    print(maxCarbs);
    try {
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
        print(response.body);
        return json.decode(response.body);
      } else {
        // If the server did not return a 200 OK response,
        // then throw an exception.
        throw Exception('Failed to load recipes');
      }

    }
    catch (e) {
      throw Exception('Failed to load recipes');
    }
  }

  getRecipes(String name, List<dynamic> tagId, int minCalories, int maxCalories, int minProtein, int maxProtein, int minFat, int maxFat, int minCarbs, int maxCarbs) async {
    this.name = name;
    this.tagId = tagId;
    this.minCalories = minCalories;
    this.maxCalories = maxCalories;
    this.minProtein = minProtein;
    this.maxProtein = maxProtein;
    this.minFat = minFat;
    this.maxFat = maxFat;
    this.minCarbs = minCarbs;
    this.maxCarbs = maxCarbs;

    print(name);

    fetchRecipes(name, tagId, minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs).then((value) async {
      recipeController.add(value);
      return value;
    },);
  }

  @override
  void initState() {
    super.initState();
    getRecipes(name, tagId, minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs);
  }

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
              onSubmitted:(value) {
                getRecipes(value, tagId, 0, 1000000, 0, 1000000, 0, 1000000, 0, 1000000);
              },
            ),
          ),
          Filter(),
          StreamBuilder(
            stream: recipeController.stream,
            builder: (context, snapshot) {
              if(snapshot.hasData) {
                if(snapshot.data.length == 0) {
                  return Container(
                    color: const Color(0xFF8ED081),
                    child: Column(
                      children: [
                        Container(
                          margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                          padding: EdgeInsets.all(10),
                          color: const Color(0xFFFFFEEE),
                          child: Center(
                            child: Text("No Recipes Found", style: TextStyle(fontSize: 20)),
                          )
                        ),
                      ]
                    ),
                  );
                }
                else {
                  return RecipeDisplay(snapshot.data);
                }
              }

              if(snapshot.hasError) {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [ Text('${snapshot.error}') ],
                );
              }

              getRecipes(
                name, 
                tagId,
                minCalories, 
                maxCalories, 
                minProtein, 
                maxProtein, 
                minFat, 
                maxFat, 
                minCarbs, 
                maxCarbs
              );

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