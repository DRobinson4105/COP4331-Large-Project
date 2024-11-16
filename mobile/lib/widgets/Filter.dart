import 'package:flutter/material.dart';
import 'package:multiple_search_selection/multiple_search_selection.dart';

class Filter extends StatelessWidget {
  final SearchController controller = SearchController();

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: Text("Filter"),
      children: [
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Calories',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Calories',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Protein',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Protein',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Fat',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Fat',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Min Carbs',
            ),
          ),
        ),
        ListTile(
          title: TextFormField(
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(horizontal: 10),
              border: UnderlineInputBorder(),
              labelText: 'Max Carbs',
            ),
          ),
        ),
        ListTile(
          title: MultipleSearchSelection(
            searchField: TextField(
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
                border: UnderlineInputBorder(),
                labelText: 'Search Tags',
              ),
            ), 
            items: ["Vegan", "Gluten Free", "Meal Prep"],
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
          )
        ),
        ListTile(
          title: ElevatedButton(
            onPressed: () {},
            child: Text('Apply Filter'),
          ),
        )
      ],
    );
  }
}