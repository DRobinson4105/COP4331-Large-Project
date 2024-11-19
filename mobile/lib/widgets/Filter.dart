import 'package:flutter/material.dart';
import 'package:multiple_search_selection/multiple_search_selection.dart';
import '../screens/SearchRecipes.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<String>> fetchTags(String name) async {
  http.Response response = await http.post(
    Uri.parse('http://nomnom.network:3000/api/tag/search'),
    headers: <String, String>{
      'Content-Type': 'application/json',
    },
    body: jsonEncode(<String, dynamic> {
      "name": name,
    }),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return jsonDecode(response.body).map<String>(
      (item) {
        return item as String;
      }
    ).toList();
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load tags');
  }
}

class Filter extends StatefulWidget {
  const Filter({super.key});

  @override
  State<Filter> createState() => FilterState();
}

class FilterState extends State<Filter> {
  final SearchController controller = SearchController();

  final nameController = TextEditingController();
  final minCaloriesController = TextEditingController();
  final maxCaloriesController = TextEditingController();
  final minProteinController = TextEditingController();
  final maxProteinController = TextEditingController();
  final minFatController = TextEditingController();
  final maxFatController = TextEditingController();
  final minCarbsController = TextEditingController();
  final maxCarbsController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: Text("Filter"),
      children: [
        ListTile(
          title: TextFormField(
            controller: minCaloriesController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Calories',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: maxCaloriesController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Calories',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: minProteinController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Protein',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: maxProteinController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Protein',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: minFatController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Fat',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: maxFatController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Fat',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: minCarbsController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Carbs',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            controller: maxCarbsController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Carbs',
            ),
          ),
        ),
        ListTile(
          title: FutureBuilder(
            future: fetchTags(""),
            builder: (context, snapshot) {
              if(snapshot.hasData) {
                return MultipleSearchSelection(
                  searchField: TextField(
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 10),
                      border: UnderlineInputBorder(),
                      labelText: 'Search Tags',
                    ),
                  ), 
                  items: snapshot.data!,
                  pickedItemBuilder: (items) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.grey[400]!),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(items),
                      ),
                    );
                  }, 
                  fieldToCheck: (Tag) {
                    return Tag;
                  }, 
                  itemBuilder: (Tag, index, isPicked) {
                    return Padding(
                      padding: const EdgeInsets.all(6.0),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          color: Colors.white,
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 20.0,
                            horizontal: 12,
                          ),
                          child: Text(Tag),
                        ),
                      ),
                    );
                  },
                  sortShowedItems: true,
                  sortPickedItems: true,
                  showSelectAllButton: false,
                );
              }
              else if(snapshot.hasError) {
                return Text('${snapshot.error}');
              }

              return const CircularProgressIndicator();
            },
          ),
        ),
        ListTile(
          title: ElevatedButton(
            onPressed: () {
              context.findAncestorStateOfType<SearchRecipesState>()!.getRecipes(
                nameController.text.toString(), 
                [], 
                minCaloriesController.text.isEmpty ? 0 : int.parse(minCaloriesController.text.toString()),
                maxCaloriesController.text.isEmpty ? 1e6 : int.parse(maxCaloriesController.text.toString()),
                minProteinController.text.isEmpty ? 0 : int.parse(minProteinController.text.toString()),
                maxProteinController.text.isEmpty ? 1e6 : int.parse(maxProteinController.text.toString()),
                minFatController.text.isEmpty ? 0 : int.parse(minFatController.text.toString()),
                maxFatController.text.isEmpty ? 1e6 : int.parse(maxFatController.text.toString()),
                minCarbsController.text.isEmpty ? 0 : int.parse(minCarbsController.text.toString()),
                maxCarbsController.text.isEmpty ? 1e6 : int.parse(maxCarbsController.text.toString()),
              );
            },
            child: Text('Apply Filter'),
          ),
        )
      ],
    );
  }
}