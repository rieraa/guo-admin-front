import { useState } from 'react'
import { Card, Table, Space, Tag, Select, message } from 'antd'
import { useEffect } from 'react'
import { http } from '@/utils'
import './index.scss'


const UserManage = () => {

    // 加载
    const [loading, setLoading] = useState(false);

    //  列
    const columns = [
        {
            title: '用户编号',
            dataIndex: 'userId'
        }
        ,
        {
            title: '用户名称',
            dataIndex: 'username',
            width: 220
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '用户角色',
            dataIndex: 'roleId',
            render: data => {
                if (data === 0) {
                    return <Tag>注册会员</Tag>
                } else if (data === 1) {
                    return <Tag color='blue'>系统管理员</Tag>
                } else if (data === 2) {
                    return <Tag color='blue'>课程资料管理员</Tag>
                } else if (data === 3) {
                    return <Tag color='blue'>公司领导</Tag>
                }
                return <Tag color='magenta' >冻结账号</Tag>
            }
        },

        {
            title: '更改权限',
            render: data => {
                return (
                    <Space size="middle">
                        <Select
                            defaultValue={data.roleId}
                            style={{
                                width: 120,
                            }}
                            onChange={async (value) => {
                                console.log(value, data.userId)
                                const res = await http.post('/update/roleid', {
                                    userId: data.userId,
                                    roleId: value
                                })
                                if (res.code === 0) {
                                    message.success("更改成功")
                                    setLoading(true);
                                    const res = await http.get('/get/alluser')
                                    setLoading(false);
                                    setList(res.data.result)
                                } else message.error('更改失败')
                            }}
                            options={[
                                {
                                    value: 0,
                                    label: '注册会员',
                                },
                                {
                                    value: 1,
                                    label: '系统管理员',
                                },
                                {
                                    value: 2,
                                    label: '公司领导',
                                },
                                {
                                    value: 4,
                                    label: '冻结账号',
                                },
                            ]}
                        />
                    </Space>
                )
            }
        }
    ]


    // 表格数据存储
    const [list, setList] = useState([])



    useEffect(() => {
        async function fetchList () {
            setLoading(true);
            const res = await http.get('/get/alluser')
            setLoading(false);
            setList(res.data.result)
        }
        fetchList()
    }, [])


    return <div className='main'>
        <Card style={{ height: '100%' }}
            title={'冻结用户'}
        >
            <Table rowKey="userId" columns={columns} dataSource={list}
                loading={loading}
            />
        </Card>

    </div>
}

export default UserManage