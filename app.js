const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const date = require(__dirname + '/views/date.js');
let items = [];
let workItems = [];
let dayInfo = date.date();
let day = dayInfo.day;
let publishYear = dayInfo.year;

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
