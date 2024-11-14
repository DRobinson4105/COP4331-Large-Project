import 'package:flutter/material.dart';
import 'screens/LogIn.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        useMaterial3: true,

        // Define the default brightness and colors.
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
        ),

        scaffoldBackgroundColor: const Color(0xFFFFFEEE),
      ),
      home: LogIn(),
    );
  }
}