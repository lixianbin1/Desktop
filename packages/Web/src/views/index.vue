<template>
  <div id="BoxList">
    <div class="box">
      <span>桌面查看</span>
    </div>
    <div class="box" @click="goinfiles">
      <span>文件查看</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { io } from 'socket.io-client';
import { showNotify } from 'vant';
import axios from 'axios';
import { router } from '@/modules/router';
import { UserInfo } from '@/apis' 

// socket
const socketStatus = ref(true)
const captureImg = ref('')
let socket = null;
// 初始化socket
const initSocket = ()=>{
  if (socket) {
    console.log('Socket链接已存在');
    return;
  }
  try {
    // const host = window.location.hostname;
    // const port = 3000;
    // const url = `http://${host}:${port}`;
    const socket = io('/',{
      reconnection: true, // 启用重连
      reconnectionAttempts: 3, // 重连尝试次数
      reconnectionDelay: 1000, // 重连间隔时间（毫秒）
      reconnectionDelayMax: 5000, // 最大重连间隔时间（毫秒）
      timeout: 10000, // 连接超时时间（毫秒）
    })
    socket.on('connect', () => {
      socketStatus.value = true
      socket.emit('capture')
    });
    socket.on('capture', (data) => {
      captureImg.value = `data:image/png;base64,${data}`;
      socket.disconnect()
    });
    socket.on('connect_error', (error) => {
      showNotify({ type: 'danger', message: '连接Socket服务失败，尝试重连...' });
      socketStatus.value = false
    });
  } catch (error) {
    console.log(error)
  }
}

const getUserInfo = ()=>{
  UserInfo().then(res=>{
    if(res.code === 200){
      console.log(res.data)
    }else{
      localStorage.removeItem('userToken')
      router.replace('/login')
    }
  })
}

//转跳文件
const goinfiles = ()=>{
  router.push('/FileList')
}
const files = reactive({
  list: []
})
const initfiles = ()=>{
  axios.get('/api/files').then(res=>{
    files.list = res.data
  })
}
onMounted(() => {
  // initSocket();
  // initfiles()
  getUserInfo()
});

onBeforeUnmount(() => {
  if (socket) {
    socket.off('connect'); // 移除 connect 事件监听器
    socket.off('capture'); // 移除 capture 事件监听器
    socket.disconnect(); // 关闭连接
    socket = null;
  }
});
</script>

<style setup lang="scss">
#BoxList{
  height: 100%;
  margin: 0.3rem;
  background: #fff;
  border-radius: 0.1rem;
  padding: 0.2rem;
  display: flex;
  justify-content: space-evenly;
  .box{
    height: 2rem;
    width: 3rem;
    line-height: 1rem;
    margin-bottom: 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 0.2rem;
    background: #ccc;
    box-shadow: 1px 1px 4px #000;
    span{
      font-size: 0.3rem;
    }
  }
}
</style>