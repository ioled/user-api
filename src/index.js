const express = require('express');
const expressConfig = require('./config/express');

// Create the express app and load all middlewares and configurations.
const userApi = express();
expressConfig(userApi);

module.exports = {
  userApi,
};
