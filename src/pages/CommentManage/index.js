import { useState } from 'react'
import { Card, Button, Table, Space, message } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { useEffect } from 'react'
import { http } from '@/utils'
import './index.scss'


const CommentManage = () => {

    // 加载
    const [loading, setLoading] = useState(false);

    //  列
    const columns = [
        {
            title: '评论编号',
            dataIndex: 'commentId'
        }
        ,
        {
            title: '评论内容',
            dataIndex: 'commentContent',
        },
        {
            title: '评论时间',
            dataIndex: 'commentTime',
        },
        {
            title: '用户名称',
            dataIndex: 'username',
        },
        {
            title: '审核',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="round" icon={<CheckOutlined />}
                            onClick={async () => {
                                await updateState(data.commentId, 1)
                            }}
                        >通过</Button>
                        <Button danger shape="round" icon={<CloseOutlined />}
                            onClick={async () => {
                                await updateState(data.commentId, 2)
                            }}
                        >拒绝</Button>
                    </Space>
                )
            }
        }
    ]


    // 表格数据存储
    const [list, setList] = useState([])


    const updateState = async (commentId, status) => {
        const res = await http.post('/update/status', {
            commentId, status
        })
        if (res.code === 0) {
            message.success('修改成功')
            await http.get('/get/comments')
            setList(res.data.res)
        } else message.error('修改失败')
    }

    //获取班级题目完成情况
    useEffect(() => {

        async function fetchList () {
            setLoading(true);
            const res = await http.get('/get/comments')
            setLoading(false);
            setList(res.data.res)
            console.log(res)
        }
        fetchList()
    }, [])


    return <div className='main'>
        <Card style={{ height: '100%' }}
            title={"评论列表"}
        >
            <Table rowKey="commentId" columns={columns} dataSource={list}
                loading={loading}
            />
        </Card>

    </div>
}

export default CommentManage