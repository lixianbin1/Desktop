require('dotenv').config()
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

// 初始化Socket.IO
const socketManager = require('./common/socket.js');
socketManager.init(httpServer);

//json数据解析
app.use(express.json());

//静态资源路径
const __HomePath = process.env.XD_HomePath
app.use(express.static(path.join(__HomePath)));

//路由接口
app.use('/user', require('./interface/userapi.js'));
app.use('/file', require('./interface/fileapi.js'));

// 启动Express服务器
httpServer.listen(port, () => {
  console.log(`
    Node服务运行于 http://localhost:${port}
    按 Ctrl+C 键退出服务
    `
  );
});