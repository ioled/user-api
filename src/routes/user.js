var express = require('express');
var router = require('express').Router();

// Import controllers
var {currentUser, getDevices} = require('../controller/user');

// Router middleware to handle auth routes.
router.route('/user').post(currentUser);

router.route('/devices').post(getDevices);

// Export router
module.exports = router;
