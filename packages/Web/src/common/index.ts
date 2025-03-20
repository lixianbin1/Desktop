//退出登录

export const SignOut = ()=>{
  const {loginSwitch} = useGlobalState()
  sessionStorage.removeItem('userToken')
  loginSwitch()
  location.href = '/login'
}