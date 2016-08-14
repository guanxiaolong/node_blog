var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('port',process.env.PORT||3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/blog'
  },function() {
    console.log('connect mongodb success...');
  })}));
app.use(flash());
app.listen(app.get('port'), function () {
  console.log('Ecpress server listening on port'+app.get('port'))
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'webapp')));

routes(app);

app.use('/', routes);
app.use('/users', users);


module.exports = app;
