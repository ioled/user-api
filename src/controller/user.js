var _ = require('lodash');
const mongoose = require('mongoose');

const User = require('../services/mongoDB');

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
    res.json({error: 'User not logged in'});
  } else {
    googleID = req.body.googleID;

    // Search in the DB for the user.
    const existingUser = await User.users.findOne({googleID});
    const userInfo = _.pick(existingUser, ['name', 'email', 'photo']);

    console.log('[User-API][currentUser][Response]', userInfo);
    res.status(200).send(userInfo);
  }
};
