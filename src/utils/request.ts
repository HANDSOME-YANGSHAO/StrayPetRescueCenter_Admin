import axios from 'axios'

// axios的配置实例
const instanceConfig = {
  baseURL: ''
  // withCredentials: true // 携带证书,后端得设置Access-Control-Allow-Origin ，Access-Control-Allow-Credentials这两个字段
}

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  instanceConfig.baseURL = '/api'
}
if (process.env.NODE_ENV === 'production') {
  // 线上环境
  instanceConfig.baseURL = 'https://api.zhuishushenqi.com'
}

console.log(`环境变量======>${process.env.NODE_ENV}`)

// 创建axios的实例，这里采用代理就不配置baseUrl了，通过node去代理请求，绕过浏览器
const request = axios.create(instanceConfig)

request.interceptors.request.use(
  (config) => {
    if (window.sessionStorage.getItem('token')) {
      config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config
  },
  (err) => {
    console.log(err)
  }
)
request.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      alert(`response.status: ${res.status}`)
    }
    return res.data
  },
  (error) => {
    console.log(error)
  }
)

export default request
