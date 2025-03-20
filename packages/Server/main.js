/*
import express  from "express";
import http from "http";
import path from "path";
import pm2 from "pm2";
import 'dotenv/config'
import userapi from "./interface/userapi.js";
import fileapi from "./interface/fileapi.js";
const app = express();

//全局配置
let port = 3000;
const __HomePath = process.env.XD_HomePath

// 从命令行参数中获取端口号
const args = process.argv.slice(2);
args.forEach(arg => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.split('=')[1], 10);
  }
});


// 获取 PM2 进程名称
pm2.connect((err) => {
  if (err) {
    console.error('无法连接到 PM2:', err);
    return;
  }
  pm2.list((err, list) => {
    if (err) {
      console.error('无法获取 PM2 进程列表:', err);
      pm2.disconnect();
      return;
    }
    const currentPid = process.pid;
    const processInfo = list.find(proc => proc.pid === currentPid);
    if (processInfo?.name=="NodeServer") {
      port = 3000
    } else if(processInfo?.name=="CopyServer") {
      port = 3001
    }else{
      console.log("当前进程不是由 PM2 启动");
    }
    pm2.disconnect();
  });
});



//json数据解析
app.use(express.json());

//静态文件路径
app.use(express.static(path.join(__HomePath, 'public')));

//路由
app.use('/user',userapi)
app.use('/file',fileapi)

//健康检查
app.get('/health', (req, res) => {
  res.send('OK');
});

//http服务
http.createServer(app).listen(port, () => {
  console.log(`
    Node服务运行于 http://localhost:${port}
    按 Ctrl+C 键退出服务
    `
  );
});

*/

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

// const path = require('path');
// const pm2 = require('pm2');
// const pkg = require('sqlite3');
// const userapi = require('./interface/userapi');
// const fileapi = require('./interface/fileapi');

