import {useState, useEffect} from 'react'
import {
    Card,
    Breadcrumb,
    Button,
    Table,
    Space,
    Select,
    Tag,
    Popconfirm,
    message,
    Drawer,
    Form,
    Row,
    Col,
    Input
} from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import {useStore} from '@/store'
import {observer} from "mobx-react-lite"
import './index.scss'
import {http} from '@/utils'

const {Option} = Select;

const CourseList = () => {

    const {courseListStore} = useStore()
    const [open, setOpen] = useState(false);
    //点击修改触发回调
    const showDrawer = (data) => {

        courseListStore.courseInfo.courseId = data.courseId
        courseListStore.courseInfo.courseName = data.courseName
        courseListStore.courseInfo.logContent = data.logContent
        courseListStore.courseInfo.courseType = data.courseType

        setOpen(true);

    };
    //关闭抽屉的回调
    const onCloseDrawer = () => {
        setOpen(false);

    };

    // 提交表单回调
    const onSubmitChange = async () => {
        setOpen(false);
        const res = await courseListStore.updateCourseInfo()

        console.log(JSON.stringify(res))
        if (res.code === "0") {
            message.success('修改成功');
        } else {
            message.error('修改失败')
        }
    }




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
                        <Button type='text' size='small' shape="round"
                                onClick={() => {
                                    navigate(`/teacher/list/search?class=${siftstate.class}&question=${data.pid}`, {
                                        state: {
                                            className: siftstate.className,
                                            pbName: data.pbName
                                        }
                                    })
                                }}>查看</Button>

                        <Popconfirm
                            title="确定删除？"
                            onConfirm={async () => {
                                const res = await http.delete('/delete/course', {
                                    courseId: data.courseId,
                                })
                                if (res.code === "0") {
                                    message.success("取消成功")
                                } else (

                                    message.error("取消失败，" + res.message)
                                )
                                console.log(data.courseId)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type='text' size='small' danger>删除课程</Button>
                        </Popconfirm>

                        <Button type='text' size='small' shape="round"
                                onClick={() => {

                                    showDrawer(data)
                                }}>修改题目</Button>

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


    // 初始化下拉框
    useEffect(() => {
        courseListStore.getCourseTypeList().then(r => console.log("获取课程类别成功"))
    }, [])


    // 获取所有课程列表
    const getList = async () => {
        const res = await http.post('/api/courseinfo/search', {});
        const {records, total} = res.data.results;
        setCourse(records);
        courseListStore.total = total
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
            {/*    // onChange={(value) => {*/}
            {/*    //     const cname = classStore.getCnameById(value)*/}
            {/*    //     setSiftState({ ...siftstate, class: value, className: cname })*/}
            {/*    // }}*/}
            {/*    options={list}*/}
            {/*/>*/}
            {/*<Select*/}
            {/*    style={{*/}
            {/*        width: 120,*/}
            {/*        marginRight: '25px'*/}
            {/*    }}*/}
            {/*    placeholder="Please select an owner"*/}
            {/*    defaultValue={courseListStore.courseInfo.courseType}*/}
            {/*    fieldNames={{*/}
            {/*        label: 'typeName',*/}
            {/*        value: 'typeId',*/}
            {/*    }}*/}
            {/*    options={courseListStore.typeList}*/}
            {/*    onChange={value => {*/}
            {/*        courseListStore.courseInfo.courseType = value*/}
            {/*    }}*/}
            {/*>*/}

            {/*</Select>*/}
            {/*<Radio.Group onChange={(e) => {*/}
            {/*    setSiftState({ ...siftstate, isDemand: e.target.value })*/}
            {/*}} value={siftstate.isDemand}>*/}
            {/*    <Radio value={'0'}>全部</Radio>*/}
            {/*    <Radio value={'1'}>必做</Radio>*/}
            {/*    <Radio value={'2'}>选做</Radio>*/}
            {/*</Radio.Group>*/}
        </Card>
        <Card title={`目前共有 ${courseListStore.total} 个课程：`}
              style={{height: '100%'}}
        >
            <Table
                rowKey="courseId"
                columns={columns}
                dataSource={course}
                loading={loading}
                align="center"
            />
        </Card>


        {/*修改课程信息*/}
        <Drawer
            title="修改课程信息"
            width={720}
            onClose={onCloseDrawer}
            visible={open}
            placement="left"
            bodyStyle={{
                paddingBottom: 80,
            }}
            destroyOnClose={true}
            extra={
                <Space>
                    <Button onClick={onCloseDrawer}>取消</Button>
                    <Button onClick={onSubmitChange} type="primary">
                        提交
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="courseId"
                            label="课程id"

                        >
                            <Input
                                disabled={true}
                                value={courseListStore.courseInfo.courseId}
                                placeholder={courseListStore.courseInfo.courseId}
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="courseName"
                            label="课程名称"
                        >
                            <Input
                                style={{
                                    width: '100%',
                                }}
                                value={courseListStore.courseInfo.courseName}
                                onChange={e => {
                                    courseListStore.courseInfo.courseName = e.target.value
                                }}
                                placeholder={courseListStore.courseInfo.courseName}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="courseType"
                            label="课程类型"
                        >
                            <Select
                                placeholder="Please select an owner"
                                defaultValue={courseListStore.courseInfo.courseType}
                                fieldNames={{
                                    label: 'typeName',
                                    value: 'typeId',
                                }}
                                options={courseListStore.typeList}
                                onChange={value => {
                                    courseListStore.courseInfo.courseType = value
                                }}
                            >

                            </Select>
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="logContent"
                            label="课程介绍"
                        >
                            <Input.TextArea
                                rows={4}
                                value={courseListStore.courseInfo.logContent}
                                onChange={e => {
                                    courseListStore.courseInfo.logContent = e.target.value
                                }}
                                placeholder={courseListStore.courseInfo.logContent}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>


    </div>
}

export default observer(CourseList)