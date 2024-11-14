import 'package:flutter/material.dart';
import 'package:mobile/screens/LogIn.dart';
import '../widgets/RecipeCard.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            margin: EdgeInsets.all(10),
            child:
              Row(
                children: [
                  Column(
                    children: [
                      Image(image: ResizeImage(AssetImage('lib/assets/DefaultPFP.png'), width: 100, height: 100)),
                      Text("Lebron James"),
                    ]
                  ),
                  Expanded(
                    child: Text("An American professional basketball player for the Los Angeles Lakers of the National Basketball Association (NBA). Nicknamed 'King James'"),
                  ),
                ],
              ),
          ),
          Text("My Recipes", style: TextStyle(fontSize: 20)),
          Container(
            padding: EdgeInsets.symmetric(vertical: 10),
            color: const Color(0xFF8ED081),
            child: Column(
              children: [
                RecipeCard(),
                RecipeCard(),
                RecipeCard(),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) {
                return LogIn();
              }));
            },
            child: Text('Log Out'),
          ),
        ],
      ),
    );
  }
}