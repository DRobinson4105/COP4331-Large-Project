import 'package:flutter/material.dart';
import 'package:mobile/screens/LogIn.dart';

class ProfilePage extends StatelessWidget {
  @override
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