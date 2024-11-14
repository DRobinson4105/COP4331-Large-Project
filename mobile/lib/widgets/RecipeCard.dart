import 'package:flutter/material.dart';

class RecipeCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
      padding: EdgeInsets.all(10),
      color: const Color(0xFFFFFEEE),
      child: Row(
        children: [
          Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100,)),
          Flexible(
            child: 
            Column(
              children: [
                Text("Homemade Stew", style: TextStyle(fontWeight: FontWeight.bold)),
                Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut lab", ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
