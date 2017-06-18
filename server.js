var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var validUrl = require('valid-url');
var Url = require('./models/url');
var config = require('./config');

mongoose.connect(config.DATABASE_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: We are not connected Scotty!'));
db.once('open', function() {
  console.log('we have lift off')
});

var app = express();
var port = config.PORT;
app.use(express.static(__dirname + '/public'));

app.engine('.hbs', hbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.get('/', function(req, res, next) {
 res.render('index')
})
app.get('/new/*', function(req, res, next) {
  var userUrl = req.params[0];
    var valid = checkURL(userUrl);
    if(valid) {
      Url.find(function(err, results) {
        if(err) {
          console.log(err)
        }
        var newNumber = results.length;
        Url.create({
          originalUrl: userUrl,
          uniqueNumber: newNumber
        }, function(err, item) {
          if(err) {
            return res.status(500).json({message: err})
          }
          else {
            return res.status(201).json({url: port+'/'+newNumber})
          }

        })
      })

    }
    else {
      return res.status(500).json({message: 'You passed an invalid url as a parameter. Try again.'})
    }

  })
  app.get('/:uniqueNumber', function(req, res, next) {
    var uniqueNumber = req.params.uniqueNumber;
    Url.findOne({newUrl: uniqueNumber}, function(err, item) {
      if(err) {
        return res.status(500).json({message: 'This is not a valid entry please try again'})
      }
      else {
        res.redirect(item.originalUrl)
      }
    })
  })

app.listen(port, function() {
  console.log('app listening on port '+port)
})
function checkURL(value) {
    var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    if (urlregex.test(value)) {
        return (true);
    }
    return (false);
}
