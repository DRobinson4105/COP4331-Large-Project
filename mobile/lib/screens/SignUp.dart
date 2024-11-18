import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/LogIn.dart';
import 'package:mobile/screens/ProfilePage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void doSignUp(BuildContext context, String username, displayName, email, password, verifyPassword) async {
  RegExp emailRegex = new RegExp(r'/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/');
  RegExp alphanumericRegex = new RegExp(r'/^[a-zA-Z0-9]+$/');

  if(username.isEmpty || displayName.isEmpty || password.isEmpty || email.isEmpty) {
    print("All fields must be filled out");
    return;
  }

  if(emailRegex.hasMatch(email) == 0) {
    print("Invalid email");
    return;
  }

  if(alphanumericRegex.hasMatch(username) == 0) {
    print("Invalid username");
    return;
  }

  if(!(password == verifyPassword)) {
    print("Passwords do not match");
    return;
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
      Navigator.push(context, MaterialPageRoute(builder: (context) {
        return ProfilePage(jsonDecode(response.body)["userId"]);
      }));
    }
    print(response.body);
  }
  catch(e) {
    print("Could not sign up the user");
  }
}

class SignUp extends StatelessWidget {
  final usernameController = TextEditingController();
  final displayNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final verifyPasswordController = TextEditingController();

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
              doSignUp(context, usernameController.text.toString(), displayNameController.text.toString(), emailController.text.toString(), passwordController.text.toString(), verifyPasswordController.text.toString());
            },
            child: const Text('Sign Up'),
          ),
          const Text('Or Continue with:'),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Google'),
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