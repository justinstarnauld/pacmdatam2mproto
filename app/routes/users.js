'use strict';
const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const config = require('../config');

// Get the user profile
router.get('/', ensureLoggedIn, (req, res, next) => {
  // console.log(req.user);
  res.render('users', { user: req.user });
});

// Get the user alert page
router.get('/alerts', ensureLoggedIn, (req, res, next) => {
  res.render('users/alerts', { user: req.user });
});

// Get the user settings page
router.get('/settings', ensureLoggedIn, (req, res, next) => {
  res.render('users/settings', { user: req.user });
});

module.exports = router;
