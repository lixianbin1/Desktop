import require from './require'

const auto = import.meta.env.VITE_APP_Auto
const network = import.meta.env.VITE_APP_NetWork

// 首页json
export const HomeJson = function (params){
  return require({
    url: `${network}/${auto}/text.json`,
    method: 'get',
    params,
  })
}

// 用户登录
export const Userlogin = function (data){
  return require({
    url: `${network}/${auto}/user/login`,
    method: 'post',
    data
  })
}

// 用户注册
export const UserRegister = function (data){
  return require({
    url: `${network}/${auto}/user/register`,
    method: 'post',
    data
  })
}

// 用户信息
export const UserInfo = function (params){
  return require({
    url: `${network}/${auto}/user/userinfo`,
    method: 'get',
    params
  })
}