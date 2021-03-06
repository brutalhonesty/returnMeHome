'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var request = require('request');
var geocoder = require('geocoder');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var users = db.getUsersTable();
var items = db.getItemsTable();

function validateAddress (address, callback) {
  request({url: settings.mashape.montanaFlynn.endpoint + '?address=' + address, headers: {'X-Mashape-Key': settings.mashape.apiKey}}, function (error, response, body) {
    if(error) {
      return callback(error);
    }
    body = JSON.parse(body);
    if(body.error) {
      return callback(body.error);
    }
    return callback(null, body);
  });
}


// Edit the item in the DB.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  return res.json(500, {message: 'TODO'});
  var username = req.session.username;
  var itemId = req.body.id;
  var itemName = req.body.name;
  var descriptions = req.body.descriptions;
  var address = req.body.address;
  if(validator.isNull(itemId)) {
    return res.json(400, {message: 'Missing item id.'});
  }
  if(!validator.isUUID(itemId, 4)) {
    return res.json(400, {message: 'Invalid item id.'});
  }
  if(validator.isNull(itemName)) {
    return res.json(400, {message: 'Missing item name.'});
  }
  if(validator.isNull(descriptions) || (typeof(descriptions) === 'object' && descriptions.length === 0)) {
    return res.json(400, {message: 'Missing description(s).'});
  }
  if(validator.isNull(address)) {
    return res.json(400, {message: 'Missing address.'});
  }
  validateAddress(address, function (error, addressResp) {
    if (error) {
      console.log(error);
      return res.json(400, {message: 'Invalid address.'});
    }
    db.searchByUser(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Could not edit item.'});
      }
      var user = reply.rows[0].value;
      var userId = user._id;
      db.searchByItemId(itemId, function (error, reply) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Could not edit item.'})
        }
        var item = reply.rows[0].value;
        if(item.name !== itemName) {
          item.name = itemName;
        }
        item.descriptions = descriptions;
        if(item.address.number !== addressResp.number && item.address.street !== addressResp.street && item.address.city !== addressResp.city && item.address.zip !== addressResp.zip) {
          item.address = addressResp;
        }
        db.insert(items, item._id, item, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Could not edit item.'});
          }
          return res.json({message: 'Item edited.'});
        });
      });
    });
  });
};