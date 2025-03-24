<template>
  <div>
    <div class="box-header">
      <GoBack />
      <el-button type="success" >刷新</el-button>
      <el-button type="danger" >重连</el-button>
    </div>
    <div class="box-desktop">
      <canvas style="width:100vw;height:56.25vw;vertical-align: bottom;" id="tvNoise"></canvas>
    </div>
    <div id="box-list">
      <div class="box" v-for="item in filelist" :key="item.name" @click="getFile(item)">
        <h2>{{ item.name }}</h2>
        <p>{{ item.mtime }}</p >
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { io } from 'socket.io-client';

let noiseAnimationFrame = null;
let filelist = ref([]);
// 生成随机噪声
function generateNoise() {
  const canvas = document.getElementById('tvNoise');
  const ctx = canvas.getContext('2d');
  const idata = ctx.createImageData(canvas.width, canvas.height);
  const buffer32 = new Uint32Array(idata.data.buffer);
  for (let i = 0; i < buffer32.length; i++) {
    buffer32[i] = Math.random() > 0.6 ? 0xFF333333 : 0xFFFFFFFF;
  }
  ctx.putImageData(idata, 0, 0);
  noiseAnimationFrame = requestAnimationFrame(generateNoise);
}

// 初始化socket
const socketStatus = ref(true)
const captureImg = ref('')
let socket = null;
const initSocket = ()=>{
  filelist.value.push({name:'初始化...',mtime:new Date().toLocaleString()})
  if (socket) {
    filelist.value.push({name:'Socket链接已存在',mtime:new Date().toLocaleString()})
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
    socket.on('connected', () => {
      socketStatus.value = true
      filelist.value.push({name:'远程连接成功，桌面准备中...',mtime:new Date().toLocaleString()})
      socket.emit('capture')
    });
    socket.on('capture', (data) => {
      filelist.value.push({name:'桌面准备完毕。',mtime:new Date().toLocaleString()})
      const canvas = document.getElementById('tvNoise');
      const ctx = canvas.getContext('2d');
      // 创建图片对象
      const img = new Image();
      img.onload = () => {
        // 设置canvas实际尺寸匹配图片
        canvas.width = img.width;
        canvas.height = img.height;
        // 清除画布并绘制图片
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        // 停止雪花动画
        cancelAnimationFrame(noiseAnimationFrame);
      };
      img.src = `data:image/png;base64,${data}`;
    });
    socket.on('connect_error', (error) => {
      filelist.value.push({name:'连接Socket服务失败，尝试重连...',mtime:new Date().toLocaleString()})
      socketStatus.value = false
    });
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  generateNoise();
  initSocket()
})

// 监听路由变化
onBeforeRouteUpdate((to, from) => {

})
</script>
  
<style lang="scss" scoped>
  .box-header {
    display: flex;
    padding: 0.2rem 0.1rem 0.1rem 0.1rem;
    margin: 0;
  }
  .box-desktop{
    border: 1px solid #ccc;
  }
  #box-list {
    height: calc(100% - 60px);
    width: 100%;
    padding: 0.1rem;
    box-sizing: border-box;
    float: left;
    overflow: auto;
    > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      font-size: 3vw;
      min-height: 3vw;
      padding: 0.1rem 0;
    }
  }
</style>