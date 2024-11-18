import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:mobile/screens/ProfilePage.dart';
import 'package:mobile/screens/ForgotPassword.dart';
import 'package:mobile/screens/SignUp.dart';
//import 'package:oauth2/oauth2.dart' as oauth2;
import 'package:http/http.dart' as http;
import 'dart:convert';

final authorizationEndpoint = Uri.parse('721352943169-jluhlu775h59okavhe60ab8dd4quknhn.apps.googleusercontent.com');

Future<String> doLogIn(BuildContext context, String login, password) async {
  RegExp emailRegex = new RegExp(r'/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/');

  if(login.isEmpty || password.isEmpty) {
    return "All fields must be filled out";
  }

  try {
    http.Response response = await http.post(
      Uri.parse('http://nomnom.network:3000/api/user/login'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String> {
        if(!emailRegex.hasMatch(login))
          "username": login,
        if(emailRegex.hasMatch(login))
          "email": login,
        "password": password,
        "googleId": "",
      }),
    );

    if(response.statusCode == 200) {
      Navigator.push(context, MaterialPageRoute(builder: (context) {
        return ProfilePage(jsonDecode(response.body)["userId"]);
      }));
    }

    return jsonDecode(response.body)["error"];
  }
  catch(e) {
    return "Could not log the user in";
  }
}

class LogIn extends StatefulWidget {
  const LogIn({super.key});

  @override
  State<LogIn> createState() => LogInState();
}

class LogInState extends State<LogIn> {
  final loginController = TextEditingController();
  final passwordController = TextEditingController();

  String message = "Log in to Continue";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:  Column(
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
              controller: loginController,
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Enter your username or email',
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
                labelText: 'Enter your password',
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              doLogIn(context, loginController.text.toString(), passwordController.text.toString()).then((value) {
                setState(() {
                  message = value;
                });
              },);
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
              const Text(' • '),
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
            ],
          )
        ]
      ),
    );
  }
}