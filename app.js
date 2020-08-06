const bodyParser = require('body-parser');
const express = require('express');
const app = express();
let items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {

  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString('en-US', options);

  res.render('list', {
    kindOfDay: day,
    items: items
  })
});

app.post('/', function(req, res){
  newItem = req.body.newTask;
  items.push(newItem);
  res.redirect('/');
});


app.listen(3000, function() {
  console.log('Server is running on port 3000');
});
