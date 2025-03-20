<template>
  <div id="BoxList" style="height:100%">
    <div class="box">
      <div class="box-title">
        <h2>桌面查看</h2>
      </div>
      <div class="box-content">
        <div class="content">
          <img width="100%" height="100%" v-if="captureImg" :src="captureImg" alt=""></img>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="box-title">
        <h2>文件查看</h2>
      </div>
      <div class="box-content">
        <div class="content" @click="goinfiles">
          <div>
            <p v-for="item in files.list" style="display: flex;justify-content: space-evenly;">
              <span>{{item.name}}</span>
              <span>{{item.type}}</span>
              <span>{{item.size}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="content"></div>
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

<style>
#BoxList{
  padding: 0.05rem;
  .box{
    width: calc(50vw - 0.05rem);
    float: left;
    padding: 0.05rem;
    box-sizing: border-box;
    .box-title{
      height: 0.4rem;
      position: relative;
      background: #8aadfb;
      h2{
        font-size: 0.3rem;
        position: absolute;
        left: 0.1em;
      }
    }
    .box-content{
      height: calc(50vw / 192* 108);
      .content{
        height: 100%;
        background-color: #e5e5e5;
        font-size: 0.2rem;
      }
      .success{background-color: green}
      .error::before,
      .error::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 0.2rem; /* 线条宽度 */
        height: 50%; /* 线条高度 */
        background-color: red; /* 线条颜色 */
      }

      .error::before {
        transform: rotate(45deg); /* 旋转45度 */
      }

      .error::after {
        transform: rotate(-45deg); /* 旋转-45度 */
      }
    }
  }
}
</style>