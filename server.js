'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const thingsPlace = require('./app');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const dotenv = require('dotenv');
const socket_io = require('socket.io');
const app = express();

// Use dotenv to load enviroment variables
dotenv.load();

// Import Routes
const index = require('./app/routes/index');
const users = require('./app/routes/users');
const dashboards = require('./app/routes/dashboards');
const devices = require('./app/routes/devices');

// Configure Passport to use Auth0
const strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  });

// Enforce SSL redirect middleware function
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

passport.use(strategy);
// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/'}));


// uncomment after placing your favicon in /public
app.use(requireHTTPS)
app.use(favicon(path.join(__dirname, 'public', 'pacm-data-favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(thingsPlace.session);

// Adding Passport to our middleware flow
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
app.use('/dashboards', dashboards);
app.use('/devices', devices);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

thingsPlace.ioServer(app).listen(app.get('port'), () => {
  console.log('Server running on Port: ', app.get('port'));
});
