import require from './require'

const auto = import.meta.env.VITE_APP_Auto
const network = import.meta.env.VITE_APP_NetWork

export const HomeJson = function (params){
  return require({
    url: `${network}/${auto}/text.json`,
    method: 'get',
    params,
  })
}

export const Userlogin = function (data){
  return require({
    url: `${network}/${auto}/user/login`,
    method: 'post',
    data
  })
}

export const UserInfo = function (params){
  return require({
    url: `${network}/${auto}/user/userinfo`,
    method: 'get',
    params
  })
}