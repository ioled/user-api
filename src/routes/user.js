var express = require('express');
var router = express.Router();

const {
  currentUser,
  getDevices,
  saveDevice,
  linkUserToDevice,
  getUserByDevice,
  getAllDevices,
} = require('../controller/user');

// Router middleware to handle auth routes.
router.route('/user').post(currentUser);
router.route('/devices').post(getDevices);
router.route('/saveDevice').post(saveDevice);
router.route('/linkUser/:userId/:deviceId').put(linkUserToDevice);
router.route('/device/:id/user').get(getUserByDevice);
router.route('/allDevices').get(getAllDevices);

// Export router
module.exports = router;
