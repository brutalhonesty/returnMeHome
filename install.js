var colors = require('colors');
var settings = require('./server/config/environment');
var db = require('./server/components/database');
db.initialize('couchdb');

var userView = {views: {"all": {"map": "function(doc) {emit(null, doc)}","reduce": "_count"},"by_username": {"map": "function(doc) {emit(doc.username, doc)}","reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}}};
var itemsView = {views: {"all": {"map": "function(doc) {emit(null, doc)}","reduce": "_count"},"by_name": {"map": "function(doc) {emit(doc.name, doc)}","reduce": "_count"}, "by_id": {"map": "function(doc) {emit(doc._id, doc)}","reduce": "_count"}}};

db.createDB(settings.couchdb.users, function (err, body) {
  if(err && err.status_code !== 412) {
    return console.log(err);
  }
  var users = db.getUsersTable();
  // Insert views to make lookup calls with.
  db.insert(users, '_design/users', userView, function (err) {
    // 409 is Document update conflict.
    if(err && err.status_code !== 409) {
      console.log('Error creating database.'.red);
      return console.log(err);
    }
    db.createDB(settings.couchdb.items, function (err, body) {
      if(err && err.status_code !== 412) {
        return console.log(err);
      }
      var items = db.getItemsTable();
      // Insert views to make lookup calls with.
      db.insert(items, '_design/items', itemsView, function (err) {
        // 409 is Document update conflict.
        if(err && err.status_code !== 409) {
          console.log('Error creating database.'.red);
          return console.log(err);
        }
        console.log('DB Installation successful.'.green);
      });
    });
  });
});