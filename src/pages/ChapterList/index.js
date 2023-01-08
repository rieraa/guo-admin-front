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
    Input, Divider
} from 'antd'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useStore} from '@/store'
import {observer} from "mobx-react-lite"
import './index.scss'
import {http} from '@/utils'

const {Option} = Select;

const ChapterList = () => {



    // 章节列表
    const [chapter, setChapter] = useState([]);
    // 状态管理
    const {chapterStore} = useStore()

    //获取到路由中的课程id
    const location = useLocation()
    let msg = new URLSearchParams(location.search)
    const courseId = msg.get('id')


    //修改章节
    const [open, setOpen] = useState(false);
    //新增章节
    const [look, setLook] = useState(false);
    //点击修改触发回调
    const showDrawer = (data) => {

        chapterStore.chapterInfo.chapterId = data.chapterId
        chapterStore.chapterInfo.chapterName = data.chapterName
        setOpen(true);

    };

    const showAddDrawer = (data) => {

        chapterStore.addChapterInfo.courseId = courseId
        setLook(true);

    };
    //关闭抽屉的回调
    const onCloseDrawer = () => {
        setOpen(false);

    };

    const onCloseAddDrawer = () => {
        setLook(false);

    };

    // 提交表单回调
    const onSubmitChange = async () => {
        setOpen(false);
        const res = await chapterStore.updateChapterInfo()

        console.log(JSON.stringify(res))
        if (res.code === "0") {
            message.success('修改成功');
        } else {
            message.error('修改失败')
        }
    }

    const onSubmitAddBig = async () => {
        setLook(false);
        const res = await chapterStore.addChapterBig()
        console.log(JSON.stringify(res))
        if (res.code === "0") {
            message.success('新增成功');
        } else {
            message.error('新增失败')
        }

    }

    const onSubmitAddSmall = async () => {
        setLook(false);
        const res = await chapterStore.addChapterSmall()
        console.log(JSON.stringify(res))
        if (res.code === "0") {
            message.success('新增成功');
        } else {
            message.error('新增失败')
        }
    }

    // 加载
    const [loading, setLoading] = useState(false);


    //获取课程列表

    //表格表头
    const columns = [
        {
            title: '章节编号',
            dataIndex: 'chapterId',
        },
        {
            title: '章节名称',
            dataIndex: 'chapterName',
        },
        {
            title: '前一章节',
            dataIndex: 'preChapterId',

        },
        {
            title: '是否为根章节',
            dataIndex: 'rootChapterId',
            render: rootChapterId => {
                if (rootChapterId === "0") {
                    return <Tag color='#C06F98'>是</Tag>
                } else return <Tag color='#2474B5'>否</Tag>
            }


        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        {
                            data.rootChapterId === "0"
                                ? <Button
                                    type='text'
                                    size='small'
                                    shape="round"
                                >
                                    查看章节资料</Button>
                                : <Button
                                    type='text'
                                    size='small'
                                    shape="round"
                                    onClick={() => {
                                        console.log(data)
                                    }}>查看章节资料</Button>
                        }

                        {
                            data.rootChapterId === "0"
                                ? <Popconfirm
                                    title="确定删除？"
                                    onConfirm={async () => {
                                        const res = await http.delete('/delete/bchapter/', {

                                            data: {
                                                "courseId": [data.chapterId]
                                            }
                                        })
                                        if (res.code === "0") {
                                            message.success("删除成功")
                                        } else (

                                            message.error("删除失败，" + res.message)
                                        )
                                        console.log(data.courseId)
                                    }}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button type='text' size='small' danger>删除课程</Button>
                                </Popconfirm>
                                : <Popconfirm
                                    title="确定删除？"
                                    onConfirm={async () => {
                                        const res = await http.delete('/delete/schapter/', {
                                            data: {
                                                "courseId": [data.chapterId]
                                            }
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
                        }


                        <Button type='text' size='small' shape="round"
                                onClick={() => {
                                    showDrawer(data)
                                }}>修改章节</Button>

                    </Space>
                )
            }
        }
    ]
    const navigate = useNavigate()


    async function getAllChapter() {
        let res = await http.post('/api/chapter/all', {
            "courseId": courseId,
        })
        setChapter(res.data.result)
        chapterStore.total = res.data.result.length

        // console.log(res.data.result)
    }


    useEffect(() => {
        // 获取到所有的章节资源
        getAllChapter().then(r => console.log("获取课程列表成功"))

    }, [])


    return <div className='main'>
        <Card title={
            <Breadcrumb separator=">">
                <Breadcrumb.Item>
                    <Link to="/resourceAdmin">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <p>章节详情</p>
                </Breadcrumb.Item>
            </Breadcrumb>}
              style={{height: '100%'}}
        >

            <Button onClick={() => showAddDrawer()}>新增章节</Button>
            <Divider/>


            <Table
                rowKey="courseId"
                columns={columns}
                dataSource={chapter}
                loading={loading}
                align="center"
            />
            <p>{`本课程共有${chapterStore.total}章节`}</p>
        </Card>


        {/*修改课程信息*/}
        <Drawer
            title="修改章节信息"
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
                            label="章节id"

                        >
                            <Input
                                disabled={true}
                                value={chapterStore.chapterInfo.chapterId}
                                placeholder={chapterStore.chapterInfo.chapterId}
                            />

                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="courseName"
                            label="课程名称"
                        >
                            <Input
                                style={{
                                    width: '100%',
                                }}
                                value={chapterStore.chapterInfo.chapterName}
                                onChange={e => {
                                    chapterStore.chapterInfo.chapterName = e.target.value
                                }}
                                placeholder={chapterStore.chapterInfo.chapterName}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>

        {/*新增章节*/}
        <Drawer
            title="新增章节信息"
            width={720}
            onClose={onCloseAddDrawer}
            visible={look}
            placement="left"
            bodyStyle={{
                paddingBottom: 80,
            }}

            destroyOnClose={true}
            extra={
                <Space>
                    <Button onClick={onCloseAddDrawer}>取消</Button>
                    {
                        chapterStore.addChapterInfo.type === "big"
                            ? <Button onClick={onSubmitAddBig} type="primary">
                                大提交
                            </Button>
                            : <Button onClick={onSubmitAddSmall} type="primary">
                                小提交
                            </Button>
                    }


                </Space>
            }
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="新增类型"
                        >
                            <Select
                                placeholder="请选择新增章节类型"
                                onChange={value => {
                                    chapterStore.addChapterInfo.type = value
                                }}
                                options={[
                                    {
                                        value: 'big',
                                        label: '大章节',
                                    },
                                    {
                                        value: 'small',
                                        label: '小章节',
                                    },
                                ]}
                            >

                            </Select>
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="courseid"
                            label="课程id"

                        >
                            <Input
                                disabled={true}
                                value={courseId}
                                placeholder={courseId}
                            />

                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="chapterName"
                            label="章节名称"
                        >
                            <Input
                                style={{
                                    width: '100%',
                                }}
                                value={chapterStore.addChapterInfo.chapterName}
                                onChange={e => {
                                    chapterStore.addChapterInfo.chapterName = e.target.value
                                }}
                                placeholder="请输入章节名称"
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="preChapterId"
                            label="前一章节id"
                        >
                            <Input
                                style={{
                                    width: '100%',
                                }}
                                value={chapterStore.addChapterInfo.preChapterId}
                                onChange={e => {
                                    chapterStore.addChapterInfo.preChapterId = e.target.value
                                }}
                                placeholder="请输入前一章节id"
                            />
                        </Form.Item>
                    </Col>

                </Row>

                {
                    chapterStore.addChapterInfo.type === "small" ? <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="rootChapterId"
                                label="所在根章节id"
                            >
                                <Input
                                    style={{
                                        width: '100%',
                                    }}
                                    value={chapterStore.addChapterInfo.rootChapterId}
                                    onChange={e => {
                                        chapterStore.addChapterInfo.rootChapterId = e.target.value
                                    }}
                                    placeholder="请输入所在跟章节id"
                                />
                            </Form.Item>
                        </Col>

                    </Row> : null
                }

            </Form>
        </Drawer>


    </div>
}

export default observer(ChapterList)