var settings = require('../../config/environment');

var COUCHDB = 'couchdb';

function allowedDBTypes(type) {
  switch(type.toLowerCase()) {
    case COUCHDB:
    return true;
    default:
    return false;
  }
}

exports.initialize = function(type) {
  if(type === undefined) {
    throw new Error('Missing database type.');
  }
  if(allowedDBTypes(type)) {
    this.type = type;
  } else {
    throw new Error('The database type ' + type + 'is not allowed.');
  }
  switch(this.type) {
    case COUCHDB:
    this.nano = require('nano')(settings.couchdb.url);
    this.users = this.nano.use(settings.couchdb.users);
    this.items = this.nano.use(settings.couchdb.items);
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.createDB = function(dbName, callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.create(dbName, function (error, body) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.compactUserDB = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.compact(settings.couchdb.users, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.insert = function(db, key, data, callback) {
  switch(this.type) {
    case COUCHDB:
    db.insert(data, key, function (err) {
      if(err) {
        return callback(err);
      }
      return callback(null);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.getUsersTable = function() {
  switch(this.type) {
    case COUCHDB:
    return this.users;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.getItemsTable = function() {
  switch(this.type) {
    case COUCHDB:
    return this.items;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.peekForUser = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.head(userId, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.getUser = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.get(userId, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchByUser = function(username, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchByItem = function(itemName, callback) {
  switch(this.type) {
    case COUCHDB:
    this.items.view('items', 'by_name', {reduce: false, startkey: itemName, endkey: itemName}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchByItemId = function(itemId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.items.view('items', 'by_id', {reduce: false, startkey: itemId, endkey: itemId}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchByUserId = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_id', {reduce: false, startkey: userId, endkey: userId}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchByMultipleUserIds = function(userIds, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_id', {reduce: false, keys: userIds}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.searchUserByAll = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'all', {reduce: false}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.deleteUserByUsername = function(username, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      if(reply.rows.length === 0) {
        return callback('User does not exist.');
      }
      var user = reply.rows[0].value;
      console.log('Deleting user from DB.');
      console.log(user);
      _self.users.destroy(user._id, user._rev, function (error, body) {
        if(error) {
          return callback(error);
        }
        return callback(null, body);
      });
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.deleteItemById = function(itemId, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.items.view('items', 'by_id', {reduce: false, startkey: itemId, endkey: itemId}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      if(reply.rows.length === 0) {
        return callback('Item does not exist.');
      }
      var item = reply.rows[0].value;
      console.log('Deleting item from DB.');
      console.log(item);
      _self.items.destroy(item._id, item._rev, function (error, body) {
        if(error) {
          return callback(error);
        }
        return callback(null, body);
      });
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};

exports.deleteAllUsers = function(docs, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.bulk({docs: docs}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    default:
    throw new Error('Only couchdb is allowed.');
  }
};
