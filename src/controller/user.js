var _ = require('lodash');

const {users} = require('../services/mongoDB');

/**
 * Returns the current authenticated user.
 * @param {{user: object}} req Request. Passport.js sets req.user object.
 * @param {object} res Respose.
 */
exports.currentUser = async (req, res) => {
  console.log('[User-API][currentUser][Request]', req.params, req.body);

  // If user is not authenticated, return null.
  if (!req.body) {
    console.log('[User-API][currentUser][Error]', {error: 'User not logged in'});
    res.status(500).json({error: 'User not logged in'});
  } else {
    const {googleID} = req.body;

    try {
      // Search in the DB for the user.
      const existingUser = await users.findOne({googleID});
      const userInfo = _.pick(existingUser, ['name', 'email', 'photo']);

      console.log('[User-API][currentUser][Response]', userInfo);
      res.status(200).send(userInfo);
    } catch (error) {
      console.log('[User-API][currentUser][Error]', error);
      res.status(500).json(error);
    }
  }
};
