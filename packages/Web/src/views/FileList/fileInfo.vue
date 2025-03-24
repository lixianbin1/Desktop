<template>
  <div id="box-info">
    <div class="box-header">
      <GoBack />
      <el-button type="success"  @click="postSave">保存</el-button>
      <el-button type="danger" @click="Delete">删除</el-button>
    </div>
    <textarea class='text' v-model="filetext" />
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { FileUpload,FileInfo,FileDelete } from '@/apis/FileList';
import { router } from '@/modules/router';

let filetext = ref('');
const getFile= async()=>{
  const {filepath,filename} = router.currentRoute.value.query;
  FileInfo({
    filepath,
    filename
  }).then((resData) => {
    filetext.value = resData.data;
  }) 
}

const postSave = () => {
  const {filepath,filename} = router.currentRoute.value.query;
  FileUpload({
    filepath,
    filename,
    centent: filetext.value
  }).then((resData) => {
    ElMessage({
      message: resData.message,
      type: 'success',
    });
  })
}

const Delete = () => {
  const {filepath,filename} = router.currentRoute.value.query;
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    FileDelete({
      filepath,
      filename
    }).then((resData) => {
      if (resData.code === 200) {
        ElMessage({
          message: resData.message,
          type: 'success',
        });
        router.back()
      }
    })
  })
}

onMounted(() => {
  getFile();
});


</script>
  
<style lang="scss" scoped>
  .box-header {
    display: flex;
    padding: 0.1rem 0rem ;
    margin: 0;
  }
  #box-info {
    height: calc(100vh - 1rem);
    width: 100%;
    padding: 0.1rem;
    box-sizing: border-box;
    float: left;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .text {
      font-size: 0.3rem;
      border: 0;
      resize: none;
      outline: none;
      box-shadow: none;
      border-radius: 0;
      flex: 1;
      width: 100%;
    }
  }
</style>