'use strict';

// Development specific configuration
// ==================================
module.exports = {
  couchdb: {
    url: 'http://localhost:5984',
    users: 'lostandfound-user',
    items: 'lostandfound-item'
  },
  cookie: {
    secret: 'WcW&MA9Yrsd&tsB52dzG3vZXFqJVu0DmGn#LpQf0H#!fdJ4DtfRI3g0dUE7mFa@x'
  },
  mashape: {
    apiKey: 'm79iBJwWkwmshSj2stJ4ypjw6Wc7p1uFyOBjsnoyxo0oOOuwxY',
    metropolis: {
      endpoint: 'https://metropolis-api-phone.p.mashape.com/analysis'
    },
    montanaFlynn: {
      endpoint: 'https://montana-flynn-address-parser.p.mashape.com/parsed-address'
    }
  }
};
