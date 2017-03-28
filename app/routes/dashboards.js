'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const config = require('../config');

router.get('/', ensureLoggedIn, (req, res, next) => {
  res.render('dashboards', { user: req.user });
});

router.get('/myboards', ensureLoggedIn, (req, res, next) => {
  res.render('boards', { user: req.user });
});

module.exports = router;
