<script setup >

</script>

<template>
  <main flex justify-center items-center style="height:100%;background:#ccc;">
    <el-card w-450px style="text-align: center;padding-bottom: 20px;margin-bottom: 100px;position: relative;border-radius: 20px;">
      <h1 flex justify-center items-center text-100px style="letter-spacing:30px;padding:30px 50px 10px;font-weight: bold;" class="animation">
        404
      </h1>
      <button bth class="backbutton" >
        Back
      </button>
    </el-card>
  </main>
</template>

<style>
.backbutton{
  background: #545c64;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
}
.animation{
  position: relative;
  text-align: center;
  width: 100%;
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  animation: shake .6s ease-in-out infinite alternate;
  user-select: none;
}
@keyframes shake {
    0%,to {
        transform: translate(-1px)
    }

    10% {
        transform: translate(2px,1px)
    }

    30% {
        transform: translate(-3px,2px)
    }

    35% {
        transform: translate(2px,-3px);
        filter: blur(4px)
    }

    45% {
        transform: translate(2px,2px) skewY(-8deg) scaleX(.96);
        filter: blur(0)
    }

    50% {
        transform: translate(-3px,1px)
    }
}
</style>
