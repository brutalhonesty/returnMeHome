'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var request = require('request');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var items = db.getItemsTable();

// Deletes an item from the DB.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var itemId = req.body.id;
  if(validator.isNull(itemId)) {
    return res.json(400, {message: 'Missing item id.'});
  }
  if(!validator.isUUID(itemId, 4)) {
    return res.json(400, {message: 'Invalid item id.'});
  }
  db.searchByItemId(itemId, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete item.'});
    }
    var item = reply.rows[0].value;
    db.deleteItemById(item._id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Could not delete item.'});
      }
      return res.json({message: 'Item deleted.'});
    });
  });
};