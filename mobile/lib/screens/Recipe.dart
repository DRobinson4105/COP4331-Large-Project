import 'package:flutter/material.dart';

class RecipePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: ListView(
        shrinkWrap: true,
        children: [
          Image(image: ResizeImage(AssetImage('lib/assets/DefaultRecipePicture.png'), width: 300, height: 300,)),
          Text("Recipe Title", style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),),
          Text("By Author", style: TextStyle(fontSize: 20),),
          Text("Calories: 0"),
          Text("Protein: 0"),
          Text("Fat: 0"),
          Text("Carbs: 0"),
          ExpansionTile(
            title: Text("Description"),
            children: [
              Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce facilisis libero in magna iaculis euismod. Mauris tincidunt purus ac varius semper. Phasellus in sollicitudin est. Suspendisse ut nisi at mi viverra suscipit. Fusce pellentesque ante vitae erat luctus, vel pulvinar erat malesuada. Aenean sed pellentesque lorem, nec scelerisque arcu. Pellentesque non imperdiet lacus."),
            ],
          ),
          ExpansionTile(
            title: Text("Ingredients"),
            children: [
              Text("Proin leo arcu, placerat eget maximus sit amet, pretium a mi. Sed scelerisque magna lectus, vitae efficitur enim tempus vel. Suspendisse tempus felis eu venenatis blandit. Proin suscipit urna convallis viverra ullamcorper. Nam lobortis erat at risus sagittis malesuada sit amet in nunc. Maecenas a justo sed est suscipit vehicula a id risus. Nunc cursus mauris mi, quis mattis justo dignissim at. Cras ornare lorem non lacus interdum egestas. Aliquam eleifend libero sit amet elit scelerisque iaculis. Integer dignissim ligula sed lectus luctus pretium. Vestibulum ornare turpis a justo lobortis, ac euismod nisl feugiat. In ultrices elementum aliquam. Integer fermentum sit amet libero id sagittis."),
            ],
          ),
          ExpansionTile(
            title: Text("Instructions"),
            children: [
              Text("Vestibulum et feugiat dolor. Etiam ultricies rutrum vulputate. Aenean dui eros, ullamcorper nec turpis quis, pretium feugiat sem. Curabitur sed arcu ac purus viverra aliquam. Vestibulum sagittis risus ipsum, eget vehicula elit porta eu. Quisque eget magna rutrum enim tempus venenatis vel a ipsum. Phasellus vehicula dui a gravida efficitur."),
            ],
          ),
        ],
      ),
    );
  }
}