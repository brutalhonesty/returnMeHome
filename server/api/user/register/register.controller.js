'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('request');
var settings = require('../../../config/environment');
var db = require('../../../components/database');

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

// Register the user.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var phone = req.body.phone;
  var lat = req.body.latitude;
  var lng = req.body.longitude;

  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(password)) {
    return res.json(400, {message: 'Missing password'});
  }
  if(validator.isNull(email)) {
    return res.json(400, {message: 'Missing email.'});
  }
  if(!validator.isEmail(email)) {
    return res.json(400, {message: 'Invalid email.'});
  }
  if(validator.isNull(firstName)) {
    return res.json(400, {message: 'Missing first name.'});
  }
  if(validator.isNull(lastName)) {
    return res.json(400, {message: 'Missing last name.'});
  }
  if(validator.isNull(phone)) {
    return res.json(400, {message: 'Missing phone number.'});
  }
  if(validator.isNull(lat)) {
    return res.json(400, {message: 'Missing latitude.'});
  }
  if(validator.isNull(lng)) {
    return res.json(400, {message: 'Missing longitude.'});
  }
  if(!validator.isFloat(lat)) {
    return res.json(400, {message: 'Invalid latitude.'});
  }
  if(!validator.isFloat(lng)) {
    return res.json(400, {message: 'Invalid longitude.'});
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
    bcrypt.hash(password, 10, function (error, hash) {
      if(error) {
       console.log(error);
       return res.json(500, {message: 'Problem registering user ' + username + '.'});
     }
     var userId = uuid.v4();
     var user = {
      username: username,
      password: hash,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phoneFormatted,
      location: {
        lat: lat,
        lng: lng
      }
     };
     // Check to see if the username exists.
     db.searchByUser(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem registering user ' + username + '.'});
        }
        if(reply.rows.length > 0) {
          return res.json(400, {message: 'User already exists.'});
        }
        // Create user
        db.insert(users, userId, user, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem registering user ' + username + ', please try again.'});
          }
          req.session.username = username;
          return res.json({message: 'Registered.'});
        });
      });
    });
  });
};