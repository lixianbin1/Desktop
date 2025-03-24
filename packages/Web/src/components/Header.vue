<template>
  <el-header class="flex-center">
    <div>
      <h1 class="title" font-bold text-center @click="ToPage">
        {{ t('login.Welcome') }}
      </h1>
    </div>
    <div style="flex:3" class="user">
      <LanguageButton />
      <el-button class="userinfo" link @click="goToUser">
        <el-icon><icon-carbon-user /></el-icon>
      </el-button>
      <el-button class="signout" type="danger" link @click="SignOut" >
        <el-icon><icon-carbon-logout /></el-icon>
      </el-button>
    </div>
  </el-header>
</template>

<script setup >
const { t } = useI18n()
const router = useRouter()
const goToUser = () => {

}
const ToPage = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  h1.title{
    cursor: pointer;
    font-size: 28px;
    margin-left: 15px;
  }
  .user{
    width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
    .userinfo,.signout{font-size: 24px;}
    .signout{margin-left: 10px;}
  }
}

@media (max-width:1024px){
  .flex-center{
    padding: 0.2rem;
    height: 1rem;
    box-shadow: 0 0 0.1rem #bdbdbd;
    h1.title{
      margin:0;
      line-height: 16px;
      font-size: 20px!important;
      text-align: center;
    }
  }
}
</style>
