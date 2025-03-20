<template>
  <div id="box-list">
    <div class="box" v-for="item in filelist" :key="item.name" @click="getFile(item)">
      <h2>{{ item.name }}</h2>
      <p>{{ item.mtime }}</p >
      <p>{{ item.type }}</p >
      <p>{{ item.size }}</p >
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { FileList,FileInfo } from '@/apis/FileList';

let filelist = ref([]);
const getFileList=()=>{
  FileList().then((resData) => {
    filelist.value = resData.data;
  })
}

const getFile=(item)=>{
  FileInfo({
    filepath:item.path,
    filename:item.name
  }).then((resData) => {
    console.log(resData.data);
  })
}

onMounted(() => {
  getFileList();
});

</script>
  
<style lang="scss" scoped>
  #box-list {
    height: calc(100% - 60px);
    margin-top: 10px;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    float: left;
    overflow: auto;
    > * {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      border: 0.5px solid #e3e3e3;
      font-size: 3vw;
      min-height: 3vw;
      padding: 5px 0;
    }
  
    h2 {
      width: 26%;
      font-size: 3vw;
    }
    p{
      width:16%,
    }
  }
</style>