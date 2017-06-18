var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var Url = require('./models/url');

mongoose.connect('mongodb://localhost/url-shortener');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: We are not connected Scotty!'));
db.once('open', function() {
  console.log('we have lift off')
});

var app = express();
var port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

app.engine('.hbs', hbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.get('/', function(req, res, next) {
 res.render('index')
})
app.get('/new/:url', function(req, res, next) {
  var userUrl = req.params.url;
  Url.find(function(err, results) {
    if(err) {
      console.log(err)
    }
    console.log(results.uniqueNumber)
  })
  Url.create({
    originalUrl: userUrl,
    uniqueNumber: randomNumber()
  }, function(err, item) {
    if(err) {
      return res.status(500).json({
        message: err
      })
    }
    res.redirect('http://www.google.com');
    // res.status(201).json(item)

  })

});

//when a request for the url's unique number gets sent back the app should then return the original url and redirect to that original url

app.listen(port, function() {
  console.log('app listening on port '+port)
})
var randomNumber = function() {
  return Math.floor(Math.random() * 20000) + 1;
}
