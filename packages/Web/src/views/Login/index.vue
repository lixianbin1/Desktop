<template>
  <div id="login">
    <el-main class="main">
      <div v-loading="state.loading" class="login_box">
        <el-form ref="loginRef" :model="state.form" :rules="useRules">
          <el-form-item>
            <h2 class="title-login" text-20px>
              {{ t('login.Account') }}
            </h2>
          </el-form-item>
          <el-form-item prop="username">
            <span>{{ t('login.UserName') }}</span>
            <el-input v-model="state.form.username" clearable @keyup.enter="onLogin">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <span>{{ t('login.Password') }}</span>
            <el-input v-model="state.form.password" type="password" clearable show-password @keyup.enter="onLogin">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px;">
            <div style="text-align: center;width: 100%;">
              <el-button type="primary" class="submit-btn bthColor" plain @click="onLogin">
                {{ t('login.Login') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer style="align-items: center;display: flex;">
      <span class="footerTitle">{{ t('login.FontTitle') }}</span>
    </el-footer>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { Userlogin } from '@/apis' 
const router = useRouter()
const { t } = useI18n()
const state = reactive({
  loading: false,
  type: 'login', // login or change
  form: { // 登录请求数据
    username: '',
    password: '',
  },
})
const useRules = reactive({
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
  ],
})

//判断是否登陆
if (localStorage.getItem('userToken')) {
  router.push('./')
}

// 登录账户
const loginRef = ref();
const onLogin = async () => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      state.loading = true
      Userlogin({
        username: state.form.username,
        password: state.form.password
      }).then((data)=>{
        console.log(data)
        if(data.code==200){
          localStorage.setItem('userToken',data.token)
          router.push('./')
        }else{
          ElMessage({
            message: data.message,
            type: 'error'
          })
        }
      }).finally(()=>{
        state.loading = false
      })
    }
  })
}

</script>
<style scoped lang="scss">
#login{
  height: 100%;
  display: flex;
  flex-direction: column;
  .main{
    position: relative;
    .login_box{
      box-sizing: border-box;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #ccc;
      padding: 50px 50px 20px;
      background: #fff;
      border-bottom: 9px solid #0168da;
      width:400px; 
    }
    .title-login {
      color: #3084D7;
      font-size: 30px;
      font-family: DM Sans;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .submit-btn{
      font-size: 20px;
      width: 201px;
      height: 47px;
      flex-shrink: 0;
      --el-button-bg-color: #fff !important;
    }
  }
}
.footerTitle{
  line-height: 12px;
  display: inline-block;
  font-size: 12px;
  .link{
    cursor: pointer;
    color: #2d5afd;
  }
  width: 100%;
  color: #000;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
@media screen and (max-width: 1000px) {
  #login{
    .main{
      position: relative;
      justify-content: center;
      align-items: center;
      display: flex;
      .login_box{
        width: 100%;
        border: 0;
        position: inherit;
        transform: translate(0px, 0px);
        left: 0;
        top: 0;
        padding: 20px;
      }
    }
  }
}
</style>

<route lang="yaml">
  meta:
    layout: login
</route>