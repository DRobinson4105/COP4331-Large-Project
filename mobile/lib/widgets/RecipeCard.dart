import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import '../screens/Recipe.dart';
import 'dart:convert';

class RecipeCard extends StatefulWidget {
  const RecipeCard(this.id, this.name, this.desc, this.image, this.tags, {super.key});

  final String id;
  final String name;
  final String desc;
  final String image;
  final List<dynamic> tags;

  @override
  State<RecipeCard> createState() => RecipeCardState(id, name, desc, image, tags);
}

class RecipeCardState extends State<RecipeCard> {
  RecipeCardState(this.id, this.name, this.desc, this.image, this.tags);

  final String id;
  final String name;
  final String desc;
  final String image;
  final List<dynamic> tags;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
      padding: EdgeInsets.all(10),
      color: const Color(0xFFFFFEEE),
      child: Row(
        children: [
          if(image != "No Image")
            Image(image: ResizeImage(MemoryImage(base64Decode(image)), width: 100, height: 100)), 
          if(image == "No Image") 
            Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100)),
          Flexible(
            child: 
            Column(
              children: [
                RichText(
                  text: TextSpan(
                    text: name,
                    style: const TextStyle(color: Color(0xFF000000), fontWeight: FontWeight.bold),
                    recognizer: TapGestureRecognizer()
                    ..onTap = () => 
                      Navigator.push(context, MaterialPageRoute(builder: (context) {
                        return RecipePage();
                      })),
                  ),
                ),
                Text(desc),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
