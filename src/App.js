import {Route, Routes} from 'react-router-dom'
import LayoutPc from '@/pages/Layout'
import Login from '@/pages/Login'
import {AuthLeader, AuthResourceAdmin, AuthRoute, AuthSystemAdmin} from './components/Auth'
import LeaderrHome from './pages/LeaderHome'
import CourseList from './pages/CourseList'
import {history, HistoryRouter} from './utils/history'
// antd国际化 中文
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import TeacherClass from './pages/TeacherClass'
import TeacherQuestion from './pages/TeacherQuestion'
import TeacherDetailList from './pages/TeacherDetailList'
import TeacherReview from './pages/TeacherReview'
import TeacherClassInfo from './pages/TeacherClassInfo'
import CommentManage from './pages/CommentManage'
import UserManage from './pages/UserManage'
import ChapterList from "@/pages/ChapterList";


function App() {
    return (
        //路由配置
        <HistoryRouter history={history}>
            <ConfigProvider locale={zhCN}>
                <div className="App">
                    <Routes>
                        {/* 创建路由 path 和对应组件的关系 */}
                        {/* 需要鉴权的路由 */}
                        <Route path='/' element={
                            <AuthRoute>
                                <LayoutPc/>
                            </AuthRoute>
                        }>
                            <Route path="resourceAdmin" element={
                                <AuthResourceAdmin>
                                    <CourseList></CourseList>
                                </AuthResourceAdmin>
                            }/>
                            <Route path="resourceAdmin/chapter" element={
                                <AuthResourceAdmin>
                                    <ChapterList/>
                                </AuthResourceAdmin>
                            }/>
                            <Route path="commentManage" element={
                                <AuthResourceAdmin>
                                    <CommentManage></CommentManage>
                                </AuthResourceAdmin>
                            }
                            />
                            <Route path="userManage" element={
                                <AuthResourceAdmin>
                                    <UserManage></UserManage>
                                </AuthResourceAdmin>
                            }/>
                            <Route path="leader" element={
                                <AuthLeader>
                                    <LeaderrHome/>
                                </AuthLeader>
                            }/>
                            <Route path="teacher/list" element={
                                <AuthSystemAdmin>
                                    <CourseList/>
                                </AuthSystemAdmin>
                            }/>
                            <Route path="teacher/list/search" element={
                                <AuthSystemAdmin>
                                    <TeacherDetailList/>
                                </AuthSystemAdmin>
                            }></Route>
                            <Route path="teacher/list/search/review" element={
                                <AuthSystemAdmin>
                                    <TeacherReview/>
                                </AuthSystemAdmin>
                            }></Route>
                            <Route path='teacher/class' element={
                                <AuthSystemAdmin>
                                    <TeacherClass></TeacherClass>
                                </AuthSystemAdmin>
                            }>
                            </Route>
                            <Route path='teacher/question' element={
                                <AuthSystemAdmin>
                                    <TeacherQuestion/>
                                </AuthSystemAdmin>
                            }
                            ></Route>
                            <Route path="teacher/class/classinfo" element={
                                <AuthSystemAdmin>
                                    <TeacherClassInfo/>
                                </AuthSystemAdmin>
                            }/>
                        </Route>

                        <Route path='/login' element={<Login/>}/>
                    </Routes>
                </div>
            </ConfigProvider>

        </HistoryRouter>

    )
}

export default App
