/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  // Users
  app.use('/api/user/register', require('./api/user/register'));
  app.use('/api/user/login', require('./api/user/login'));
  app.use('/api/user/changePassword', require('./api/user/changePassword'));
  app.use('/api/user/changeProfile', require('./api/user/changeProfile'));

  // Items
  app.use('/api/item/add', require('./api/item/add'));
  app.use('/api/item/edit', require('./api/item/edit'));
  app.use('/api/item/delete', require('./api/item/delete'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
