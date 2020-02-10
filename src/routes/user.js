var express = require('express');
var router = require('express').Router();

// Import controllers
var {currentUser} = require('../controller/user');

// Router middleware to handle auth routes.
router.route('/user').post(currentUser);

// Export router
module.exports = router;
