import 'package:flutter/material.dart';
import '../screens/ProfilePage.dart';
import '../widgets/NavigationBar.dart';
import '../widgets/RecipeDisplay.dart';
import '../widgets/Filter.dart';

void changePages(BuildContext context, int index) {
  if(index == 0) {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return SearchRecipes();
    }));
  }
  else {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return ProfilePage();
    }));
  }
}

class SearchRecipes extends StatelessWidget {
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
      bottomNavigationBar: NavBar(),
    );
  }
}