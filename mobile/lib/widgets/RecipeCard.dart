import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import '../screens/Recipe.dart';

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
                RichText(
                  text: TextSpan(
                    text: 'Homemade Stew',
                    style: const TextStyle(color: Color(0xFF000000), fontWeight: FontWeight.bold),
                    recognizer: TapGestureRecognizer()
                    ..onTap = () => 
                      Navigator.push(context, MaterialPageRoute(builder: (context) {
                        return RecipePage();
                      })),
                  ),
                ),
                Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut lab", ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
