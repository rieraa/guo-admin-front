import {http} from "@/utils";
import {makeAutoObservable, runInAction} from "mobx";


class CourseList {
    courseInfo = {
        courseId: -1,
        courseName: '',
        courseType: '',
        logContent: '',

    }
    total = 0

    //菜单选项
    typeList = []

    constructor() {
        makeAutoObservable(this)  // 响应式处理
    }

    //更新课程信息
    updateCourseInfo = async () => {
        console.log(this.courseInfo.courseName)
        console.log(this.courseInfo.courseType)

        const res = await http.post(
            '/update/courseinfo',
            {
                courseId: this.courseInfo.courseId,
                courseName: this.courseInfo.courseName,
                courseType: this.courseInfo.courseType,
                logContent: this.courseInfo.logContent
            })
        return res


    }

    //获取课程类别
    getCourseTypeList = async () => {
        const res = await http.get('/api/student/courseType/all')
        runInAction(() => {
            this.typeList = res.data
        })
        return res
    }
}

const courseListStore = new CourseList()
export default courseListStore

