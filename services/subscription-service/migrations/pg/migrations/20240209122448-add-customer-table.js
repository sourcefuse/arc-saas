'use strict';

let dbm;
let type;
let seed;
let fs = require('fs');
let path = require('path');
let Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function (db) {
  let filePath = path.join(
    __dirname,
    'sqls',
    '20240209122448-add-customer-table-up.sql',
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports.down = function (db) {
  let filePath = path.join(
    __dirname,
    'sqls',
    '20240209122448-add-customer-table-down.sql',
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
