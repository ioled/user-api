var express = require('express');
var router = express.Router();

// Import controllers
var {currentUser, getDevices, saveDevice, linkUserToDevice} = require('../controller/user');

// Router middleware to handle auth routes.
router.route('/user').post(currentUser);

router.route('/devices').post(getDevices);

router.route('/saveDevice').post(saveDevice);

router.route('/linkUser/:userId/:deviceId').put(linkUserToDevice);

// Export router
module.exports = router;
