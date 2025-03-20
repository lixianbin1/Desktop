import axios from 'axios'
// import abort from './abort'

//全局配置
axios.defaults.timeout = 3 * 60 * 1000 //设置超时
axios.defaults.withCredentials = false //表示跨域请求时是否需要使用凭证
  //跨域配置
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*'
//请求拦截器
axios.interceptors.request.use((config) => {
  //缓存接口
  // abort.judge({ url: config.url || '', method: config.method || ''})
  //添加身份验证
  if (config.headers.Authorization === undefined) {
    let token = localStorage.getItem('userToken')
    config.headers.Authorization = token
  }
  return config
}, (error) => {
  return Promise.reject(error.data.error.message)
})

//响应拦截器
axios.interceptors.response.use((config) => {
  //清除缓存接口
  // abort.remove({ url: config.config.url || '', method: config.config.method || '' })
  // 更新身份验证
  // if (config.headers.authorization && config.headers.authorization !== 'null') {
  // }
  if (config.status === 200 || config.status === 204){
    return Promise.resolve(config)
  }
  return Promise.reject(config)
}, (error) => {
  if (axios.isCancel(error)){
    return Promise.reject(false)
  }
  return Promise.reject(error)
})
// 封装的require请求
export const require = (option) => {
  return new Promise((fulfill, reject) => {
    axios(option).then((res) => {
      fulfill(res.data)
    }).catch((rej) => {
      if (rej.response){
        reject(rej.response)
      }else if (rej.request){
        reject(rej.request)
      }else{
        reject(rej.message)
      }
    })
  })
}

export default require
