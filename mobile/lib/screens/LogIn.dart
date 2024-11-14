import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/ProfilePage.dart';
import 'package:mobile/screens/ForgotPassword.dart';
import 'package:mobile/screens/SignUp.dart';

class LogIn extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image(image: ResizeImage(AssetImage('lib/assets/NomNomNetworkLogo.png'), width: 100, height: 100)),
          Text("Nom Nom Network", style: TextStyle(fontSize: 36)),
          TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Enter your username or email',
            ),
          ),
          TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Enter your password',
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) {
                return ProfilePage();
              }));
            },
            child: const Text('Continue'),
          ),
          const Text('Or Continue with:'),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Google'),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              RichText(
                text: TextSpan(
                  text: 'Forgot Password?',
                  style: const TextStyle(
                    color: Colors.blue,
                    decoration: TextDecoration.underline,
                  ),
                  recognizer: TapGestureRecognizer()
                  ..onTap = () => 
                    Navigator.push(context, MaterialPageRoute(builder: (context) {
                      return ForgotPassword();
                    })),
                ),
              ),
              const Text('•'),
              RichText(
                text: TextSpan(
                  text: 'Create an account',
                  style: const TextStyle(
                    color: Colors.blue,
                    decoration: TextDecoration.underline,
                  ),
                  recognizer: TapGestureRecognizer()
                  ..onTap = () => 
                    Navigator.push(context, MaterialPageRoute(builder: (context) {
                      return SignUp();
                    })),
                ),
              ),
            ],
          )
        ]
      ),
    );
  }
}