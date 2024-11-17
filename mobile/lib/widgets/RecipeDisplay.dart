import 'package:flutter/material.dart';
import '../widgets/RecipeCard.dart';

class RecipeDisplay extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Container(
            padding: EdgeInsets.symmetric(vertical: 10),
            color: const Color(0xFF8ED081),
            child: Column(
                children: [
                RecipeCard(),
                RecipeCard(),
                RecipeCard(),
                ],
            ),
        );
    }
}