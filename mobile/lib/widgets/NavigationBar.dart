import 'package:flutter/material.dart';
import '../screens/ProfilePage.dart';
import '../screens/SearchRecipes.dart';

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

class NavBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: [
        BottomNavigationBarItem(
          icon: Icon(Icons.search_sharp),
          label: "Search",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_sharp),
          label: "Profile"
        ),
      ],
      onTap: (index) => changePages(context, index),
    );
  }
}