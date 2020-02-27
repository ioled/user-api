const _ = require('lodash');

const {users, Devices} = require('../services/mongoDB');

const {addDevice, setUserToDevice} = require('../services/firestore');

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
      res.status(200).send({currentUser: userInfo});
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
      res.status(200).send({userDevices: devices});
    } catch (error) {
      console.log('[User-API][getDevices][Error]', error);
      res.status(500).json(error);
    }
  }
};

/**
 * Save a new device in the firestore database
 * @description Save new device in the database
 * @param {{body: {duty: number, state: boolean, timerOn: string, timerOff: string, timerState: boolean, deviceID: string}}} req Request.
 * @param {object} res Response.
 */
exports.saveDevice = async (req, res) => {
  console.log('[User-API][saveDevice][Request]', req.params, req.body);
  const {duty, state, timerOn, timerOff, timerState, deviceID} = req.body;

  const device = {
    duty,
    state,
    timerOn,
    timerOff,
    timerState,
    deviceID,
  };

  try {
    const ref = await addDevice(device);
    console.log('[User-API][saveDevice][Response]', ref.id);
    res.status(200).send({newDevice: ref.id});
  } catch (error) {
    console.log('[User-API][saveDevice][Error]', error);
    res.status(500).json(error);
  }
};

/**
 * Link a device to a user
 * @description Set the devices' user property to the specified user
 * @param {{params: {userId: string, deviceId: string}}} req Request.
 * @param {object} res Response.
 */
exports.linkUserToDevice = async (req, res) => {
  console.log('[User-API][linkUserToDevice][Request]', req.params);
  const {userId, deviceId} = req.params;

  try {
    const updatedDevice = await setUserToDevice(deviceId, userId);
    console.log('[User-API][linkUserToDevice][Response]', updatedDevice);
    res.status(200).send({updatedDevice});
  } catch (error) {
    console.log('[User-API][linkUserToDevice][Error]', error);
    res.status(500).json(error);
  }
};
