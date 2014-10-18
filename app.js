var path = require('path');
var logger = require('morgan');
var express = require('express');
var mongo = require('mongodb');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var Db = mongo.Db;
var Server = mongo.Server;
var db = new Db('peacecorp',
  new Server('localhost', '27017', {auto_reconnect: true}, {}),
  {safe: true}
);
db.open(function(){});

app.use(function(req, res, next){
  req.db = db;
  next();
});

var routes = require('./routes');
app.use('/', routes);

require('./scrape.js')(app, db);
//app.refreshData();

setInterval(function() {
  //console.log("refreshing data");
  //app.refreshData();
},30000)

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
