let io = null;
const { capture,captureing,closeCapture } = require('./capture.js');
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
    console.log('有用户连接:', socket.id);
    socket.emit('connected', '连接成功!');

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
      console.log('User disconnected:', socket.id);
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