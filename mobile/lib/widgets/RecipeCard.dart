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
  State<RecipeCard> createState() => RecipeCardState();
}

class RecipeCardState extends State<RecipeCard> {
  RecipeCardState();

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) {
          return RecipePage(widget.id);
        }));
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
        padding: EdgeInsets.all(10),
        color: const Color(0xFFFFFEEE),
        child: Row(
          children: [
            if(widget.image != "No Image")
              Image(
                image: ResizeImage(MemoryImage(base64Decode(widget.image)), width: 100, height: 100),
                errorBuilder: (context, error, stackTrace) {
                  return Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100));
                },
              ),
            if(widget.image == "No Image")
              Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100)),
            Flexible(
              child: ListTile(
                title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    RichText(
                      text: TextSpan(
                        text: widget.name,
                        style: const TextStyle(color: Color(0xFF000000), fontWeight: FontWeight.bold),
                        recognizer: TapGestureRecognizer()
                      ),
                    ),
                    Text(widget.desc),
                    Container(
                      height: 30,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: widget.tags.map((tag) {
                          return Container(
                            margin: EdgeInsets.only(right: 5),
                            padding: const EdgeInsets.all(3.0),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.black)
                            ),
                            child: Text(tag),
                          );
                        }).toList(),
                      ),
                    ) 
                  ],
                ),
              ) ,
            ),
          ],
        ),
      ),
    );
  }
}
