<template>
  <div id="main">
    <Header />
    <RouterView />
  </div>
</template>

<script setup >
onMounted(() => {
  document.documentElement.style.fontSize = document.documentElement.clientWidth /7.5 + 'px';
  window.onresize = () => {
    return (() => {
      document.documentElement.style.fontSize = document.documentElement.clientWidth /7.5 + 'px';
    })()
  }
})
</script>
