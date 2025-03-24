<template>
  <div>
    <div class="box-header">
      <GoBack />
      <el-button type="success" @click="CreateFile">创建</el-button>
      <el-button type="danger" @click="Delete">删除</el-button>
    </div>
    <div id="box-list">
      <div class="box" v-for="item in filelist" :key="item.name" @click="getFile(item)">
        <h2>{{ item.name }}</h2>
        <p>{{ item.mtime }}</p >
        <p>{{ item.type }}</p >
        <p>{{ item.size }}</p >
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { router } from '@/modules/router';
import { FileList,FileCreate,FilesDelete } from '@/apis/FileList';

// 获取文件列表
let filelist = ref([]);
let filePath = ref('');
const getFileList=(isRouter = false,name)=>{
  if(!isRouter){
    name = router.currentRoute.value.query.name
  }
  filePath.value = name || '' ;
  console.log(name);
  FileList({name}).then((resData) => {
    filelist.value = resData.data;
  })
}

// 创建文件
const CreateFile=()=>{
  ElMessageBox.prompt('请输入文件名称','创建文件',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /[\w\W]+/,
    inputErrorMessage: '文件名不能为空',
    type: 'warning',
  }).then(({ value }) => {
    FileCreate({
      filename:value,
      filepath:filePath.value
    }).then((resData) => {
      if (resData.code === 200) {
        ElMessage({
          message: resData.message,
          type: 'success',
        });
        getFileList();
      }else{
        ElMessage({
          message: resData.message,
          type: 'error',
        });
      }
    })
  })

}

// 判断是文件还是文件夹
const getFile=(item)=>{
  if(!item.type){ // 返回
    let str = item.path.split('/').slice(0, -1).join('/');
    router.push({
      path:'/FileList',
      query:{
        name:str
      }
    })
  }else if(item.type === '文件夹'){
    router.push({
      path:'/FileList',
      query:{
        name:item.path +'/'+ item.name
      }
    })
  }else{
    console.log('转跳详情页fileInfo')
    router.push({
      path:'/FileList/fileInfo',
      query:{
        filepath:item.path,
        filename:item.name
      }
    })
  }
}

const Delete = () => {
  ElMessageBox.confirm('此操作将永久删除该文件夹及文件夹内所有文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
      FilesDelete({
        filepath:filePath.value,
    }).then((resData) => {
      if (resData.code === 200) {
        ElMessage({
          message: resData.message,
          type: 'success',
        });
        router.back()
      }else{
        ElMessage({
          message: resData.message,
          type: 'error',
        });
      }
    })
  })
}

onMounted(() => {
  console.log('mount');
  getFileList();
})

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
  getFileList(true,to.query.name);
})
</script>
  
<style lang="scss" scoped>
  .box-header {
    display: flex;
    padding: 0.2rem 0.1rem 0.1rem 0.1rem;
    margin: 0;
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
      justify-content: space-around;
      align-items: center;
      position: relative;
      border: 0.5px solid #e3e3e3;
      font-size: 3vw;
      min-height: 3vw;
      padding: 0.1rem 0;
      background-color: #fff;
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