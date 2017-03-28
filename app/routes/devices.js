'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const config = require('../config');

router.get('/', ensureLoggedIn, (req, res, next) => {
  res.render('devices', { user: req.user, host: config.host });
});

module.exports = router;
