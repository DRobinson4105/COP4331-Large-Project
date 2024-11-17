import 'package:flutter/material.dart';
import '../widgets/NavigationBar.dart';
import '../widgets/RecipeDisplay.dart';
import '../widgets/Filter.dart';

class SearchRecipes extends StatelessWidget {
  SearchRecipes(this.userId);

  final String userId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        shrinkWrap: true,
        children: [
          SearchBar(
            leading: const Icon(Icons.search),
            hintText: "Search Recipes",
          ),
          Filter(),
          RecipeDisplay(),
        ]
      ),
      bottomNavigationBar: NavBar(userId),
    );
  }
}