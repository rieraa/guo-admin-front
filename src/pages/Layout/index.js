import {Layout, Menu, Popconfirm} from 'antd'
import {Outlet, Link, useNavigate} from 'react-router-dom'
// 连接react和mobx状态的
import {observer} from 'mobx-react-lite'
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined,
    AlignLeftOutlined,
    FormOutlined
} from '@ant-design/icons'
import './index.scss'
import {useStore} from '@/store'
import {useEffect} from 'react'
import {useState} from 'react'

const {Header, Sider} = Layout
const LayoutPc = () => {
    const [selectedKey, setSelectedKey] = useState()
    const {userStore, loginStore} = useStore()
    // 区分角色变量
    // 0:会员 1：系统管理员 2：课程资料管理员 3 公司领导 4.冻结
    let isTeacher = "1"
    const navigate = useNavigate()
    const onLogout = () => {
        loginStore.loginOut()
        navigate('/login')
    }
    const onClick = (e) => {
        setSelectedKey(e.key)
    }

    // useEffect(() => {
    //   async function getUserInfo () {
    //     const res = await userStore.getUserInfo()
    //     if (res.status === 1) {
    //       loginStore.loginOut()
    //       navigate('/login')
    //     }
    //   }
    //   getUserInfo()
    // }, [userStore, loginStore, navigate])


    function Item({isTeacher}) {
        if (isTeacher === "1") {
            return (
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={selectedKey}
                    style={{height: '100%', borderRight: 0}}
                    onClick={onClick}
                    defaultSelectedKeys={"teacher"}
                >
                    <Menu.Item style={{marginTop: 0}} icon={<HomeOutlined/>} key="teacher">
                        <Link to="/teacher">用户管理</Link>
                    </Menu.Item>
                    <Menu.Item icon={<DiffOutlined/>} key="tlist">
                        <Link to="/teacher/list">评论管理</Link>
                    </Menu.Item>
                </Menu>
            )
        } else if (isTeacher === "2") {
            return (
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={selectedKey}
                    style={{height: '100%', borderRight: 0}}
                    onClick={onClick}
                    defaultSelectedKeys={"student"}
                >
                    <Menu.Item icon={<AlignLeftOutlined/>} key="student" style={{marginTop: 0}}>
                        <Link to="/classOverview">课程概览</Link>
                    </Menu.Item>


                </Menu>
            )
        } else if (isTeacher === "3") {
            return (
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={selectedKey}
                    style={{height: '100%', borderRight: 0}}
                    onClick={onClick}
                    defaultSelectedKeys={"teacher"}
                >
                    <Menu.Item icon={<AlignLeftOutlined/>} key="student" style={{marginTop: 0}}>
                        <Link to="/student">课程类型统计</Link>
                    </Menu.Item>
                    <Menu.Item icon={<AlignLeftOutlined/>} key="studentinfo">
                        <Link to="/studentinfo">观看次数</Link>
                    </Menu.Item>
                </Menu>
            )
        }

    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo"/>
                <div className="user-info">
                    <span
                        className="user-name">{isTeacher ? userStore.userInfo.name : userStore.userInfo.nickname}</span>
                    <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined/> 退出
            </Popconfirm>
          </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Item isTeacher={isTeacher}></Item>
                </Sider>
                <Layout className="layout-content" style={{padding: 20}}>
                    {/* 嵌套路由 */}
                    {/*<Outlet></Outlet>*/}
                </Layout>
            </Layout>
        </Layout>
    )
}

export default observer(LayoutPc) 