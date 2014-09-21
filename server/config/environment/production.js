'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  couchdb: {
    url: 'http://localhost:5984',
    users: 'lostandfound-user',
    items: 'lostandfound-item'
  },
  cookie: {
    secret: '' // 64+ key.
  },
  mashape: {
    apiKey: '', // Mashape API key
    metropolis: {
      endpoint: 'https://metropolis-api-phone.p.mashape.com/analysis'
    },
    montanaFlynn: {
      endpoint: 'https://montana-flynn-address-parser.p.mashape.com/parsed-address'
    }
  },
  imgur: {
    apiKey: '' // Imgur API key
  },
  aws: {
    access_key: '', // AWS Access Key
    secret_access_key: '' // AWS Secret Access Key
  }
};