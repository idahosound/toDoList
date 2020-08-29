const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const date = require(__dirname + '/views/date.js');

mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = {
  name: String
};
const Item = mongoose.model ("item", itemSchema);
// Add Default MongoDB items here
// const wake = new Item ({
//   name: "Wake Up"
// });
// const rise = new Item ({
//   name: "Get Out of Bed"
// });
// const comb = new Item ({
//   name: "Drag a Comb Across Yer Head"
// });
// Item.insertMany([wake, rise, comb], function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Items added');
//   };
// });


let items = [];
let workItems = [];
let dayInfo = date.date();
let day = dayInfo.day;
let publishYear = dayInfo.year;

let itemList = Item.find(function(err, item){
  if (err){
    console.log(err);
  } else {
    item.forEach(function(item){
      items.push(item.name)
    });
  };
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res) {
  res.render('list', {
    listTitle: day,
    items: items,
    publishYear: publishYear,
  })
});

app.post('/', function(req, res){
  console.log(req.body);
  let newItem = req.body.newTask;
  let list = req.body.list;
  if (list === "Work") {
    workItems.push(newItem);
    res.redirect('/work');
  } else {
    items.push(newItem);
    res.redirect("/");
  };

});

app.get("/work", function (req, res){
  res.render('list', {
    listTitle: "Work List",
    items: workItems,
    publishYear: publishYear
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    publishYear: publishYear
  });
});



app.listen(3000, function() {
  console.log('Server is running on port 3000');
});
