'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const config = require('../config');
const h = require('../helpers');

router.get('/', ensureLoggedIn, (req, res, next) => {
  h.findUserByAuth0Id(req.user.id).then(localUser => {
    // let localUserDevices = { userDeviceArray: localUser.savedDevices };
    res.render('devices', { user: req.user, deviceArray: localUser.savedDevices, localUserArray: JSON.stringify(localUser.savedDevices), host: config.host });
  });
});

module.exports = router;
