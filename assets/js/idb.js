/**
 * Convert Json Array in CSV
 * @since 2014-02-12
 * @author Vilmar Bispo Filho <vilmarbf.ads@gmail.com>
 */ 

var iDB = {};
var datastore = null;

iDB.open = function(callback) {

  var version = 1;

  var request = indexedDB.open('jsontocsv', version);

  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    e.target.transaction.onerror = iDB.onerror;

    if (db.objectStoreNames.contains('conversion')) {
      db.deleteObjectStore('conversion');
    }

    var store = db.createObjectStore('conversion', {
      keyPath: 'timestamp'
    });
  };

  request.onsuccess = function(e) {
    datastore = e.target.result;

    callback();
  };

  request.onerror = iDB.onerror;
};

iDB.fetchConversions = function(callback) {
  var db = datastore;
  var transaction = db.transaction(['conversion'], 'readwrite');
  var objStore = transaction.objectStore('conversion');

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objStore.openCursor(keyRange);

  var conversions = [];

  transaction.oncomplete = function(e) {
    callback(conversions);
  };

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;

    if (!!result == false) {
      return;
    }

    conversions.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = iDB.onerror;
};

iDB.createConversion = function(text, callback) {
  var db = datastore;

  var transaction = db.transaction(['conversion'], 'readwrite');

  var objStore = transaction.objectStore('conversion');

  var timestamp = new Date().getTime();

  var conversion = {
    'text': text,
    'timestamp': timestamp
  };

  var request = objStore.put(conversion);

  request.onsuccess = function(e) {
    callback(conversion);
  };

  request.onerror = iDB.onerror;
};

iDB.deleteTodo = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['conversion'], 'readwrite');
  var objStore = transaction.objectStore('conversion');

  var request = objStore.delete(id);

  request.onsuccess = function(e) {
    callback();
  }

  request.onerror = function(e) {
    console.log(e);
  }
};
