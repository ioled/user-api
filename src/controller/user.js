const {
  addDevice,
  setUserToDevice,
  getUser,
  getDevices,
  getAllDevicesWithUserInfo,
  getUserByDevice,
} = require('../services/firestore');

/**
 * @CristianValdivia
 * Returns the current authenticated user.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
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
      const {user: userInfo} = await getUser(googleID);

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
 * @param {{user: object}} req googleID
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
      // Search in the DB for the devices.
      const devices = await getDevices(googleID);

      console.log('[User-API][getDevices][Response]', devices);
      res.status(200).send({userDevices: devices});
    } catch (error) {
      console.log('[User-API][getDevices][Error]', error);
      res.status(500).json(error);
    }
  }
};

/**
 * @DiegoSepulveda
 * Save a new device in the firestore database with default config
 * @description Save new device in the database
 * @param {{body: {user: string, deviceID: string}}} req Request.
 * @param {object} res Response.
 */
exports.saveDevice = async (req, res) => {
  console.log('[User-API][saveDevice][Request]', req.params, req.body);
  const {user, deviceID, power} = req.body;

  const device = {
    alias: deviceID,
    duty: 1,
    state: true,
    timerOn: '00:00',
    timerOff: '00:00',
    timerState: false,
    user,
    deviceID,
    week: 1,
    power,
  };

  try {
    const ref = await addDevice(device);
    console.log('[User-API][saveDevice][Response]', {newDevice: deviceID});
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

/**
 * @DiegoSepulveda
 * List all the devices
 * @description List the devices registered in Firestore database
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "devices": [
 *   {
 *    "device": "esp32_...",
 *    "user":
 *      {"fullName": "...", "email": "...", "profilePic": "..."}
 *   },
 *   ...
 *  ]
 * }
 */
exports.getAllDevices = async (req, res) => {
  console.log('[User-API][getAllDevices][Request]');
  try {
    const devices = await getAllDevicesWithUserInfo();

    console.log('[User-API][getAllDevices][Response] ', devices);
    res.status(200).json({data: devices});
  } catch (error) {
    console.log('[User-API][getAllDevices][Error] ', error);
    res.status(500).json({error});
  }
};

/**
 * Get the user related to the device
 * @description Controller that returns a JSON object with the user information of the device user
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "user": {
 *    "fullName": "John Doe",
 *    "email": "johndoe@gmail.com",
 *    "profilePic": "..."
 *  }
 * }
 */

exports.getUserByDevice = async (req, res) => {
  const {id} = req.params;
  console.log('[User-API][getUserByDevice (' + id + ')][Request] ', req.params);
  try {
    const user = await getUserByDevice(id);
    console.log('[User-API][getUserByDevice (' + id + ')][Response] ', user);
    res.status(200).json({data: user});
  } catch (error) {
    console.log('[User-API][getUserByDevice (' + id + ')][Error] ', error);
    return res.status(500).json({error});
  }
};
