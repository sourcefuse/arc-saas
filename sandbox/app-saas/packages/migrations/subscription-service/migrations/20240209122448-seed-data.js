"use strict";

var dbm;
var type;
var seed;
var fs = require("fs");
var path = require("path");
var Promise;
var dotenv = require("dotenv");
var dotenvExt = require("dotenv-extended");

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
  dotenv.config();
  dotenvExt.load({
    schema: ".env.example",
    errorOnMissing: true,
    includeProcessEnv: true,
  });
};

exports.up = function (db) {
  var filePath = path.join(
    __dirname,
    "sqls",
    "20240209122448-seed-data-up.sql"
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
      if (err) return reject(err);
      console.log("received data: " + data);

      resolve(data);
    });
  }).then(function (data) {
    data = data.replaceAll("{{ADMIN_USER_TENANT_ID}}", process.env.ADMIN_USER_TENANT_ID);
    return db.runSql(data);
  });
};

exports.down = function (db) {
  var filePath = path.join(
    __dirname,
    "sqls",
    "20240209122448-seed-data-down.sql"
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
      if (err) return reject(err);
      console.log("received data: " + data);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
