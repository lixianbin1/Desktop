//设置全局状态
export const useGlobalState = createGlobalState(()=>{
  let status = !!sessionStorage.getItem('userToken')
  const loginStatus = ref(false)
  loginStatus.value = status
  const loginSwitch = ()=>{
    loginStatus.value=!loginStatus.value
  }
  return {loginStatus,loginSwitch}
})
//持久存储
export const useLocaleUser = createGlobalState(()=>{
  return useStorage('user',{
    name:"Lxb"
  })
})

//用户信息
export const useUserInfo = createGlobalState(()=>useStorage('userInfo',{},sessionStorage))

export const useGlobalMenu = createGlobalState(()=>useStorage('userMenu',{},sessionStorage))
