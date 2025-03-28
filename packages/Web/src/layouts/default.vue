<template>
  <div id="main">
    <Header v-if="!isFullscreen"/>
    <RouterView />
  </div>
</template>

<script setup >
const isFullscreen = useFullscreen();

onMounted(() => {
  document.documentElement.style.fontSize = document.documentElement.clientWidth /7.5 + 'px';
  window.onresize = () => {
    return (() => {
      document.documentElement.style.fontSize = document.documentElement.clientWidth /7.5 + 'px';
    })()
  }
})
</script>
