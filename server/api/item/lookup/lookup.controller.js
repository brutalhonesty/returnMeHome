'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var request = require('request');
var uuid = require('node-uuid');
var aws2  = require('aws2');
var parser = require('xml2json');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var items = db.getItemsTable();

// Lookup item based on incoming request.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var query = req.query.query;
  var category = req.query.category;
  var lookupOptions = {
    host: 'webservices.amazon.com',
    path: '/onca/xml?Service=AWSECommerceService&Operation=ItemSearch&Keywords=' + query + '&AssociateTag=foobar&SearchIndex=' + category
  };
  aws2.sign(lookupOptions, {
    accessKeyId: settings.aws.access_key,
    secretAccessKey: settings.aws.secret_access_key
  });
  request("https://" + lookupOptions.host + lookupOptions.path, function (error, response, body) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not lookup item.'});
    }
    var jsonBody = parser.toJson(body);
    jsonBody = JSON.parse(jsonBody);
    var titleList = [];
    for (var i = 0; i < jsonBody['ItemSearchResponse']['Items']['Item'].length; i++) {
      var title = jsonBody['ItemSearchResponse']['Items']['Item'][i]['ItemAttributes']['Title'];
      titleList.push(title);
    }
    return res.json(titleList);
  });
};