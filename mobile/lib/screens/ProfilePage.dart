import 'package:flutter/material.dart';
import 'package:mobile/screens/LogIn.dart';
import '../widgets/RecipeDisplay.dart';
import '../widgets/NavigationBar.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Profile {
  final String name;
  final String desc;
  final String image;
  final List<dynamic> recipes;

  const Profile ({
    required this.name,
    required this.desc,
    required this.image,
    required this.recipes,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      name: json["name"] == null ? "" : json["name"],
      desc: json["desc"] == null ? "" : json["desc"],
      image: json["image"] == null ? "No Image" : json["image"],
      recipes: json["recipes"] == null ? [] : json["recipes"],
    );
  }
}

Future<Profile> fetchProfile(String id) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/user/get'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, String> {
      "id": id,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Profile.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load profile');
  }
}

class ProfilePage extends StatefulWidget {
  const ProfilePage(this.userId, {super.key});

  final String userId;

  @override
  State<ProfilePage> createState() => ProfilePageState(userId);
}

class ProfilePageState extends State<ProfilePage> {
  ProfilePageState(this.userId);

  final String userId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<Profile>(
        future: fetchProfile(userId),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView(
              shrinkWrap: true,
              children: [
                Container(
                  margin: EdgeInsets.all(10),
                  child:
                    Row(
                      children: [
                        Column(
                          children: [
                            if(snapshot.data!.image != "No Image")
                              Image(
                                image: ResizeImage(MemoryImage(base64Decode(snapshot.data!.image)), width: 100, height: 100),
                                errorBuilder: (context, error, stackTrace) {
                                  return Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 100, height: 100));
                                },
                              ),
                            if(snapshot.data!.image == "No Image") 
                              Image(image: ResizeImage(AssetImage('lib/assets/DefaultPFP.png'), width: 100, height: 100)),
                            Text(snapshot.data!.name),
                          ]
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          child: Text(snapshot.data!.desc),
                        ),
                      ],
                    ),
                ),
                ListTile(
                  title: Text("My Recipes", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                ),
                RecipeDisplay(snapshot.data!.recipes),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) {
                      return LogIn();
                    }));
                  },
                  child: Text('Log Out'),
                ),
              ],
            );
          } 
          else if (snapshot.hasError) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text('${snapshot.error}'),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) {
                      return LogIn();
                    }));
                  },
                  child: Text('Log Out'),
                ),
              ],
            );
          }

          // By default, show a loading spinner.
          return Center(
            child: const CircularProgressIndicator(),
          );
        },
      ),
      bottomNavigationBar: NavBar(userId),
    );
  }
}