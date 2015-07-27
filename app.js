require('dotenv').load()

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var routes = require('./routes/site');
var gifs = require('./routes/gifs');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1) // trust first proxy

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //logger middleware generates a detailed log.
app.use(bodyParser.json());   // returns middleware that only parses json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  //responsible for taking incoming cookie header and presenting that to you in a useful property of the request object
app.use(cookieSession({ name: 'session',keys: [process.env.key1, process.env.key2]})) //view counter, handles using a cookie to create a nice session variable
app.use(express.static(path.join(__dirname, 'public'))); //accessing our public route

app.use('/', routes);
app.use('/gifs', gifs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
