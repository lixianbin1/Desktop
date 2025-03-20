<template>
  <RouterView />
</template>

<script setup lang="ts">
  import {useRoute,useRouter} from 'vue-router'
  // const route = useRoute()
  const router = useRouter()

  //路由转跳前业务逻辑
  router.beforeEach((to, _from, next) => {
    //判断是否登录
    const token = localStorage.getItem('userToken')
    if(!token && to.name !== 'Login'){
      router.replace('/Login')
    }else{
      next()
    }
  })

  //路由转跳结束前业务逻辑
  router.afterEach(() => {
    //...
  })
</script>

<style scoped>
</style>
