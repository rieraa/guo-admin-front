import {useState} from 'react'
import {Card, Breadcrumb, Radio, Button, Table, Space, Select, Tag, Popconfirm, message} from 'antd'
import {EyeOutlined} from '@ant-design/icons'
import {Link, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import {useStore} from '@/store'
import {observer} from "mobx-react-lite"
import './index.scss'
import {http} from '@/utils'

const TeacherList = () => {

    // 加载
    const [loading, setLoading] = useState(false);

    // 课程列表
    const [course, setCourse] = useState([]);

    //获取课程列表

    //表格表头
    const columns = [
        {
            title: '课程编号',
            dataIndex: 'courseId',
        },
        {
            title: '课程名称',
            dataIndex: 'courseName',
        },
        {
            title: '课程类型',
            dataIndex: 'courseType',
            render: courseType => {
                switch (courseType) {
                    case "1": {
                        return <Tag color='#C06F98'>理学</Tag>
                    }
                    case "2": {
                        return <Tag color='#EC8AA4'>工学</Tag>
                    }
                    case "3": {
                        return <Tag color='#2474B5'>外语</Tag>
                    }
                    case "4": {
                        return <Tag color='#61649F'>经济管理</Tag>
                    }
                    case "5": {
                        return <Tag color='#66A9C9'>计算机</Tag>
                    }
                    case "6": {
                        return <Tag color='#F8C387'>信息学</Tag>
                    }
                    default: {
                        return <Tag color='blue'>暂无分类</Tag>
                    }
                }

            }
        },
        {
            title: '课程介绍',
            dataIndex: 'logContent',
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="round" icon={<EyeOutlined/>}
                                onClick={() => {
                                    navigate(`/teacher/list/search?class=${siftstate.class}&question=${data.pid}`, {
                                        state: {
                                            className: siftstate.className,
                                            pbName: data.pbName
                                        }
                                    })
                                }}>查看</Button>

                        <Popconfirm
                            title="确定从该班取消发布这道题吗?"
                            onConfirm={async () => {
                                const res = await http.post('/teacher/question/deleteClassQuestion', {
                                    pid: data.pid,
                                    cid: siftstate.class
                                })
                                if (res.status === 0) {
                                    setLoading(true);
                                    const res = await http.post("/teacher/records/list", {
                                        cid: siftstate.class,
                                        mustdo: siftstate.isDemand,
                                        pageSize: tableParams.pageSize,
                                        currentPage: tableParams.current
                                    })
                                    const {countAll, results} = res.data
                                    setLoading(false);
                                    setCodeList({
                                        list: results,
                                        count: countAll
                                    })
                                    setTableParams(tableParams => (
                                        {...tableParams, total: countAll}
                                    ))
                                    message.success("取消成功")
                                } else (
                                    message.error("取消失败，" + res.message)
                                )
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button shape='round' danger>取消发布</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    const navigate = useNavigate()
    const {classStore} = useStore()
    // 下拉菜单存储
    const [list, setList] = useState([])

    // 记录筛选的状态
    const [siftstate, setSiftState] = useState({
        class: 1,
        isDemand: '0',
        className: 'loading'
    })

    // 表格数据存储
    const [codelist, setCodeList] = useState({
        list: [],
        count: 0
    })

    // 表格参数管理
    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 5,
        showSizeChanger: true
    })

    const handleTableChange = (pagination) => {
        setTableParams(
            pagination
        )
    }


    // 初始化下拉框
    useEffect(() => {

    }, [])


    // 获取所有课程列表
    const getList = async () => {
        const res = await http.post('/api/courseinfo/search', {});
        const {records} = res.data.results;
        console.log(res.data.results.records[0].courseType)
        setCourse(records);
        // console.log(records)
    };


    useEffect(() => {
        getList().then(r => console.log("获取课程列表成功"))
    }, [])


    return <div className='main'>
        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/resourceAdmin">首页</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>}
        >

            {/*<Select*/}
            {/*    style={{*/}
            {/*        width: 120,*/}
            {/*        marginRight: '25px'*/}
            {/*    }}*/}
            {/*    value={siftstate.class}*/}
            {/*    onChange={(value) => {*/}
            {/*        const cname = classStore.getCnameById(value)*/}
            {/*        setSiftState({ ...siftstate, class: value, className: cname })*/}
            {/*    }}*/}
            {/*    options={list}*/}
            {/*/>*/}
            {/*<Radio.Group onChange={(e) => {*/}
            {/*    setSiftState({ ...siftstate, isDemand: e.target.value })*/}
            {/*}} value={siftstate.isDemand}>*/}
            {/*    <Radio value={'0'}>全部</Radio>*/}
            {/*    <Radio value={'1'}>必做</Radio>*/}
            {/*    <Radio value={'2'}>选做</Radio>*/}
            {/*</Radio.Group>*/}
        </Card>
        <Card title={`目前共有 ${codelist.count} 个课程：`}
              style={{height: '100%'}}
        >
            <Table
                rowKey="pid"
                columns={columns}
                dataSource={course}
                pagination={tableParams}
                onChange={handleTableChange}
                loading={loading}
            />
        </Card>
    </div>
}

export default observer(TeacherList)    