require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();

//json数据解析
app.use(express.json());

//静态资源路径
const __HomePath = process.env.XD_HomePath
app.use(express.static(path.join(__HomePath)));

//路由接口
app.use('/user', require('./interface/userapi.js'));
app.use('/file', require('./interface/fileapi.js'));

// 启动Express服务器
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`
    Node服务运行于 http://localhost:${port}
    按 Ctrl+C 键退出服务
    `
  );
});