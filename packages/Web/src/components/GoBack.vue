<template>
  <el-button type="warning"  @click="goBack">返回</el-button>
</template>
<script setup >

import { router } from '@/modules/router';
const goBack=()=>{
  router.back()
}
</script>
  