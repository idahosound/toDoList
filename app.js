const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const date = require(__dirname + '/views/date.js');

mongoose.connect('mongodb://localhost:27017/todoListDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemSchema = {
  name: String
};
const Item = mongoose.model("item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("list", listSchema);

// Add Default MongoDB items here
const wake = new Item({
  name: "Wake Up"
});
const rise = new Item({
  name: "Get Out of Bed"
});
const comb = new Item({
  name: "Drag a Comb Across Yer Head"
});
let defaultItems = [wake, rise, comb]

let dayInfo = date.date();
let day = dayInfo.day;
let publishYear = dayInfo.year;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('DefaultItems added');
        };
      });
      res.redirect('/');
    } else {
      res.render('list', {
        listTitle: day,
        items: foundItems,
        publishYear: publishYear
      });
    };
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;
  console.log(req.params);
  List.findOne({
    name: customListName
  }, function(err, customList) {
    if (!customList) {
      //Create a new List
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save(() => res.redirect("/" + customListName));

    } else {
      //Show an existing List
      res.render('list', {
        listTitle: customList.name,
        items: customList.items,
        publishYear: publishYear
      });
    };
  });
});

app.post('/', function(req, res) {
  const itemName = req.body.newTask;
  const listName = req.body.list;
  let task = new Item({
    name: itemName
  });
  List.findOne({name:listName}, function(err, foundList){
    if (foundList === null) {
      task.save();
      res.redirect("/");
    } else {
      foundList.items.push(task);
      foundList.save();
      res.redirect("/" + listName);
    };
    });
});

app.post('/delete', function(req, res) {
  const checkedValue = req.body.checkbox;
  const listName = req.body.listName;

  List.findOne({name:listName}, function(err, foundList){
    if (foundList === null){
      Item.findByIdAndRemove(checkedValue, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully deleted');
        };
        res.redirect('/');
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedValue}}}, function(err, foundList){
        if(!err){
          res.redirect("/" + listName);
        };
      });
    };
  });
});

app.listen(3000, function() {
  console.log('Server is running on port 3000');
})
