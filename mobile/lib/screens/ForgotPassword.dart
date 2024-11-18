import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/LogIn.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void sendRecoveryEmail(String email) async {
  http.post(
    Uri.parse('http://nomnom.network:3000/api/user/passwordReset'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, dynamic> {
      "email": email,
    }),
  );
}

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => ForgotPasswordState();
}

class ForgotPasswordState extends State<ForgotPassword> {
  String message = "Forgot password? We'll send a recovery email to";

  final emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Image(image: ResizeImage(AssetImage('lib/assets/NomNomNetworkLogo.png'), width: 100, height: 100)),
          const Text("Nom Nom Network", style: TextStyle(fontSize: 36)),
          ListTile(
            title: Center(child: Text(message)),
          ),
          ListTile(
            title: TextFormField(
              controller: emailController,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter your email',
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                message = "If there is an account with the provided email address, an email will be sent.";
              });
              sendRecoveryEmail(emailController.text.toString());
            },
            child: const Text('Send Recovery Email'),
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