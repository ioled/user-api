var routes = require('../routes');
var bodyParser = require('body-parser');

/**
 * Load express configuration
 * @module express/config
 * @param app The express app.
 */
//  Express configuration
module.exports = (app) => {
  // Use body-parser middleware.
  app.use(bodyParser.json());

  // Use all routes
  app.use(routes);
};
