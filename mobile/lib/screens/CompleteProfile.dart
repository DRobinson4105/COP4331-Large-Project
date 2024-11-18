import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/LogIn.dart';

class CompleteProfile extends StatelessWidget {
  const CompleteProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Image(image: ResizeImage(AssetImage('lib/assets/NomNomNetworkLogo.png'), width: 100, height: 100)),
          const Text("Nom Nom Network", style: TextStyle(fontSize: 36)),
          Text("Choose your username and display name"),
          ListTile(
            title: TextFormField(
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter a username',
              ),
            ),
          ),
          ListTile(
            title: TextFormField(
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter a display name',
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) {
                return LogIn();
              }));
            },
            child: const Text('Sign Up'),
          ),
          RichText(
            text: TextSpan(
              text: 'Back to Log in',
              style: const TextStyle(
                color: Colors.blue,
                decoration: TextDecoration.underline,
              ),
              recognizer: TapGestureRecognizer()
              ..onTap = () => 
                Navigator.push(context, MaterialPageRoute(builder: (context) {
                  return LogIn();
                })),
            ),
          ),
        ]
      ),
    );
  }
}