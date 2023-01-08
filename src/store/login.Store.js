// 登录模块
import { makeAutoObservable } from "mobx"
import { http, getToken, setToken, clearToken } from '@/utils'

class LoginStore {
    token = getToken() || ''
    // 响应式mobx固定写法
    constructor() {
        makeAutoObservable(this)
    }
    // 登录
    getToken = async ({ username, password }) => {
        const res = await http.post('/api/auth/login', {
            username,
            password
        })
        this.token = res.data.token
        setToken(res.data.token)
        return res
    }

    // 退出登录
    loginOut = () => {
        this.token = ''
        localStorage.removeItem("role")
        clearToken()
    }
}
export default LoginStore