'use strict';
const session = require('express-session');
const config = require('../config');

if (process.env.NODE_ENV === 'production') {
  // initialize sesssion with setttings for production
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  });
} else {
  // initialize session with settings for dev
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  });
}
