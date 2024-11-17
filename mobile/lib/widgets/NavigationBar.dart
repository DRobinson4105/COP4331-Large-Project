import 'package:flutter/material.dart';
import '../screens/ProfilePage.dart';
import '../screens/SearchRecipes.dart';

void changePages(BuildContext context, int index, String userId) {
  if(index == 0) {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return SearchRecipes(userId);
    }));
  }
  else {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return ProfilePage(userId);
    }));
  }
}

class NavBar extends StatelessWidget {
  NavBar(this.userId);

  final String userId;

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
      onTap: (index) => changePages(context, index, userId),
    );
  }
}