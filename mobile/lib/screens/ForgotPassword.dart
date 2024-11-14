import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/LogIn.dart';

class ForgotPassword extends StatelessWidget {
  const ForgotPassword({super.key});

    @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Image(image: ResizeImage(AssetImage('lib/assets/NomNomNetworkLogo.png'), width: 100, height: 100)),
          const Text("Nom Nom Network", style: TextStyle(fontSize: 36)),
          TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Enter your email',
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) {
                return LogIn();
              }));
            },
            child: const Text('Continue'),
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