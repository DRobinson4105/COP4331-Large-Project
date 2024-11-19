import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/LogIn.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<String> doSignUp(BuildContext context, String username, displayName, email, password, verifyPassword) async {
  RegExp emailRegex = new RegExp(r'/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/');
  RegExp alphanumericRegex = new RegExp(r'/^[a-zA-Z0-9]+$/');

  if(username.isEmpty || displayName.isEmpty || password.isEmpty || email.isEmpty) {
    return "All fields must be filled out";
  }

  if(emailRegex.hasMatch(email) == 0) {
    return "Invalid email";
  }

  if(alphanumericRegex.hasMatch(username) == 0) {
    return "Invalid username";
  }

  if(!(password == verifyPassword)) {
    return "Passwords do not match";
  }

  try {
    http.Response response = await http.post(
      Uri.parse('http://nomnom.network:3000/api/user/signup'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String> {
        "username": username,
        "displayName": displayName,
        "email": email,
        "password": password,
        "googleId": "",
      }),
    );

    if(response.statusCode == 200 || response.statusCode == 201) {
      return "Verify your account before logging in. An email has been sent.";
    }
    return jsonDecode(response.body)["error"];
  }
  catch(e) {
    return "Could not sign up the user";
  }
}

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => SignUpState();
}

class SignUpState extends State<SignUp> {
  final usernameController = TextEditingController();
  final displayNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final verifyPasswordController = TextEditingController();

  String message = "Sign up to Continue";

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
            title: Center(
              child: Text(message),
            )
          ),
          ListTile(
            title: TextFormField(
              controller: usernameController,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter a username',
              ),
            ),
          ),
          ListTile(
            title: TextFormField(
              controller: displayNameController,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter a display name',
              ),
            ),
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
          ListTile(
            title: TextFormField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter a password',
              ),
            ),
          ),
          ListTile(
            title: TextFormField(
              controller: verifyPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Retype your password',
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              doSignUp(
                context, 
                usernameController.text.toString(), 
                displayNameController.text.toString(), 
                emailController.text.toString(), 
                passwordController.text.toString(), 
                verifyPasswordController.text.toString()
              ).then((value) {
                setState(() {
                  message = value;
                });
              });
            },
            child: const Text('Sign Up'),
          ),
          RichText(
            text: TextSpan(
              text: 'Already have an account? Log in',
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