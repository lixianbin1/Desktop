<template>
  <button type="button" @click="goBack">Back</button>
</template>
<script setup lang="ts">
const router = useRouter()
const goBack=()=>{
  router.back()
}
</script>
  