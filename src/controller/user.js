const _ = require('lodash');

const {users, Devices} = require('../services/mongoDB');

/**
 * Returns the current authenticated user.
 * @param {{user: object}} req Request. Passport.js sets req.user object.
 * @param {object} res Respose.
 */
exports.currentUser = async (req, res) => {
  console.log('[User-API][currentUser][Request]', req.params, req.body);
  const {user} = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log('[User-API][currentUser][Error]', {error: 'User not logged in'});
    res.status(500).json({error: 'User not logged in'});
  } else {
    try {
      // Search in the DB for the user.
      const existingUser = await users.findOne({googleID});
      const userInfo = _.pick(existingUser, ['name', 'lastName', 'email', 'photo']);

      console.log('[User-API][currentUser][Response]', userInfo);
      res.status(200).send({data: userInfo});
    } catch (error) {
      console.log('[User-API][currentUser][Error]', error);
      res.status(500).json(error);
    }
  }
};

/**
 * @CristianValdivia
 * List all the registered devices for the current user.
 * @description List the devices registered in the user database.
 * @param {{user: {id: string}}} req Request.
 * @param {object} res Response.
 */
exports.getDevices = async (req, res) => {
  console.log('[User-API][getDevices][Request]', req.params, req.body);
  const {user} = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log('[User-API][getDevices][Error]', {error: 'User not logged in'});
    res.status(500).json({error: 'User not logged in'});
  } else {
    try {
      // Search in the DB for the user.
      const existingUser = await users.findOne({googleID});
      const userInfo = _.pick(existingUser, ['_id']);
      const devices = await Devices.find(
        {_user: userInfo._id},
        'deviceId duty state alias timerOn timerOff timerState',
      );

      console.log('[User-API][getDevices][Response]', devices);
      res.status(200).send({data: devices});
    } catch (error) {
      console.log('[User-API][getDevices][Error]', error);
      res.status(500).json(error);
    }
  }
};
