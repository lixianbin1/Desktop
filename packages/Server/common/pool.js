// common/database.js
const sqlite3 = require('sqlite3').verbose(); // 引入sqlite3模块
const genericPool = require('generic-pool');  // 引入generic-pool模块
const factory = {
  create: function() { // 创建一个数据库实例
    return new Promise(function(resolve, reject) {
      let db = new sqlite3.Database('./SQLite.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => { // 创建数据库实例
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  },
  destroy: function(db) { // 销毁一个数据库实例
    return new Promise(function(resolve) {
      db.close();
      resolve();
    });
  }
};

const opts = {
  max: 10, // 最大连接数
  min: 2  // 最小连接数
};

const myPool = genericPool.createPool(factory, opts); // 创建连接池
module.exports = myPool; // 导出连接池
