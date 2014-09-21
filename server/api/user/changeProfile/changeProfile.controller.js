'use strict';

var validator = require('validator');
var request = require('request');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');
var users = db.getUsersTable();

function validatePhone(phone, callback) {
  var apiCall = settings.mashape.metropolis.endpoint + '?country=US&telephone=' + phone;
  request({url: apiCall, headers: {'X-Mashape-Key': settings.mashape.apiKey}}, function (error, response, body) {
    if(error) {
      return callback(error);
    }
    return callback(null, JSON.parse(body));
  });
}

// Updates the user's profile.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var phone = req.body.phone;
  var email = req.body.email;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(firstName)) {
    return res.json(400, {message: 'Missing first name.'});
  }
  if(validator.isNull(lastName)) {
    return res.json(400, {message: 'Missing last name.'});
  }
  if(validator.isNull(email)) {
    return res.json(400, {message: 'Missing email.'});
  }
  if(!validator.isEmail(email)) {
    return res.json(400, {message: 'Invalid email.'});
  }
  if(validator.isNull(phone)) {
    return res.json(400, {message: 'Missing phone number.'});
  }
  validatePhone(phone, function (error, phoneResp) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Error registering user.'});
    }
    var phoneFormatted = phoneResp['formatted-number'];
    if(!phoneResp.valid) {
      return res.json(400, {message: 'Invalid phone number.'});
    }
    db.searchByUser(username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem updating profile.'});
      }
      var user = reply.rows[0].value;
      var userId = user.id;
      if(user.lastName !== lastName) {
        user.lastName = lastName;
      }
      if(user.firstName !== firstName) {
        user.firstName = firstName;
      }
      if(user.email !== email) {
        user.email = email;
      }
      if(user.phone !== phone) {
        user.phone = phone;
      }
      db.insert(users, userId, user, function (error) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem updating profile.'});
        }
        return res.json({message: 'Profile updated.'});
      });
    });
  });
};