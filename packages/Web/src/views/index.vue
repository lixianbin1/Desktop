<template>
  <div id="BoxList">
    <div class="box" @click="goDesktop">
      <span>桌面查看</span>
    </div>
    <div class="box" @click="goinfiles">
      <span>文件查看</span>
    </div>
  </div>
</template>

<script setup>
import { router } from '@/modules/router';
import { UserInfo } from '@/apis' 

// 获取用户信息
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
const goDesktop = ()=>{
  router.push('/Desktop')
}

onMounted(() => {
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