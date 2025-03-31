let io = null;
const { capture,captureing,closeCapture } = require('./capture.js');
const jwt = require('jsonwebtoken');
const Nedb = require('@seald-io/nedb');
const path = require('path');
const __SecretKey = process.env.XD_SECRETKEY;
const __rootname = path.resolve(__dirname,'..');
const socketDB = new Nedb({
    filename: __rootname + '\\DB\\socket.db',
    autoload: true
});
// 初始化Socket服务
const init = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  });
  
  io.on('connect', (socket) => {
    const token = socket.handshake.auth.token;
    let userinfo
    try {
      jwt.verify(token, __SecretKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            socket.emit('error', 'Token 已过期，请重新登录!');
          } else if (err.name === 'JsonWebTokenError') {
            socket.emit('error', '无效的 Token!');
          } else {
            socket.emit('error', '无权限访问!');
          }
          socket.disconnect();
        } else {
          userinfo = decoded;
          // 插入数据
          socketDB.insert({ 
            socketid:socket.id, 
            username:userinfo.username, 
            userid: userinfo._id,
            date: new Date().toLocaleString()
          }, (err, doc) => {
            if (err) {
              socket.emit('error', '无权限访问!');
              socket.disconnect();
            }
          });
          console.log('有用户连接:', socket.id);
          socket.emit('connected', '连接成功!');
        }
      });
    } catch (error) {
      socket.emit('error', '无权限访问!');
      socket.disconnect();
    }
    
    socket.on('capture', (msg) => {
      capture(socket);
    });
    socket.on('captureing', (msg) => {
      captureing(socket);
    });
    socket.on('takeclose', () => {
      closeCapture();
    });
    socket.on('disconnect', () => {
      closeCapture()
      console.log('用户断开连接:', socket.id);
    });
  });
  return io;
};

// 获取io实例（用于其他模块）
const getIO = () => {
  if (!io) throw new Error('Socket.io 未初始化');
  return io;
};

module.exports = { init, getIO };