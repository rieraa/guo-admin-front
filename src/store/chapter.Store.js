import {http} from "@/utils";
import {makeAutoObservable, runInAction} from "mobx";


class ChapterStore {

    addChapterInfo = {
        chapterName: "",
        preChapterId: "",
        courseId: "",
        // 小章节专供
        rootChapterId: "",
        type: "big",

    }


    constructor() {
        makeAutoObservable(this)  // 响应式处理
    }

    total = 0

    chapterInfo = {
        chapterId: -1,
        chapterName: ""
    }
    //更新章节信息
    updateChapterInfo = async () => {

        const res = await http.post(
            '/update/chapter',
            {
                chapterId: this.chapterInfo.chapterId,
                chapterName: this.chapterInfo.chapterName,

            })
        return res


    }
    //获取课程类别

    //大章节新增
    addChapterBig = async () => {
        const res = await http.post('/add/bigchapter', {
            chapterName: this.addChapterInfo.chapterName,
            preChapterId: this.addChapterInfo.preChapterId,
            courseId: this.addChapterInfo.courseId
        })

        return res
    }

    //小章节新增
    addChapterSmall = async () => {
        const res = await http.post('/add/littlechapter', {
            chapterName: this.addChapterInfo.chapterName,
            preChapterId: this.addChapterInfo.preChapterId,
            courseId: this.addChapterInfo.courseId,
            rootChapterId: this.addChapterInfo.rootChapterId
        })

        return res
    }


}

const chapterStore = new ChapterStore()
export default chapterStore

