import axios from 'axios'
import { getToken } from './token'
axios.defaults.withCredentials = true;
const http = axios.create({

    baseURL: 'http://127.0.0.1:4523/m1/2033778-0-default',
    timeout: 5000,
    withCredentials: true
})
http.defaults.withCredentials = true
// 添加请求拦截器
http.interceptors.request.use((config) => {
    //token注入
    const token = getToken()
    if (token) {
        config.headers.Authorization = `${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 使用的histroy主要就是为了在组件外能够调用路由信息进行跳转.当res里的token失效的时候触发
    // if (error.response.status === 401) {
    //     // 删除token
    //     clearToken()
    //     // 跳转到登录页
    //     history.push('/login')
    // }
    // return Promise.reject(error)
})

export { http }