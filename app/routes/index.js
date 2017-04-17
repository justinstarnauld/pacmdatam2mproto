'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const config = require('../config');
const User = require('../db/user');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
}

const auth0Options = require('../config')

// GET Home Page
router.get('/', (req, res, next) => {
  res.render('index');
});

// Render Login Template
router.get('/login',(req, res, next) => {
  res.render('login', { env: env, options: JSON.stringify(auth0Options.auth0Config) });
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/dashboards'
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/dashboards');
    User.createUser(req.user.id, req.user);
  });

module.exports = router;
