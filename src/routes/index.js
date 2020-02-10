var express = require('express');
var app = express();

// Import routes
var userRoute = require('./user');

// Use routes
app.use(userRoute);

// Export app
module.exports = app;
