//退出登录

export const SignOut = ()=>{
  const {loginSwitch} = useGlobalState()
  localStorage.removeItem('userToken')
  loginSwitch()
  location.href = '/login'
}