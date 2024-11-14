import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Row(
            children: [
              Column(
                children: [
                  Image(image: ResizeImage(AssetImage('lib/assets/DefaultPFP.png'), width: 100, height: 100)),
                  Text("Display Name"),
                ]
              ),
              Text("Description"),
            ],
          ),
        ],
      ),
    );
  }
}