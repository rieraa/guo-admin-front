import { Card, Button, Form, Input, message } from 'antd'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import cookie from 'react-cookies'
function Login () {
    const { loginStore } = useStore()
    const navigate = useNavigate()
    const onFinish = async (values) => {
        const res = await loginStore.getToken({
            username: values.username,
            password: values.password
        })
        if (res.code === 0) {

            // 跳转首页
            cookie.save("token", loginStore.token)

            // 区分角色变量
            // 0:会员 1：系统管理员 2：课程资料管理员 3 公司领导 4.冻结
            if (res.data.roleId === 1) {
                localStorage.setItem("role", `${res.data.roleId}`)
                navigate('/systemAdmin', { replace: true })
                message.success("登录成功")
            } else if (res.data.roleId === 2) {
                localStorage.setItem("role", `${res.data.roleId}`)
                navigate('/resourceAdmin', { replace: true })
                message.success("登录成功")
            } else if (res.data.roleId === 3) {
                localStorage.setItem("role", `${res.data.roleId}`)
                navigate('/leader"', { replace: true })
                message.success("登录成功")
            } else message.error('权限不足')
        } else {
            message.error("登录失败，" + res.message)
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }
    return (
        <div className='login'>
            <Card className='login-container'>
                <p className='login-container-title'>慕课学习系统后台管理</p>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    validateTrigger={['onBlur']}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{
                            message: '用户名不能超过20位',
                            validateTrigger: 'onBlur',
                            max: 20
                        },
                        {
                            required: true,
                            message: '用户名不能为空!',
                        },
                        ]}
                    >
                        <Input placeholder='请输入用户名' />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '密码不能为空!',
                            }
                        ]}
                    >
                        <Input.Password placeholder='请输入密码' />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '15px' }}>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login