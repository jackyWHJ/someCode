import { Toast } from 'antd-mobile';

export const API ={
    SubjectDetail:'/learn/app/clientapi/course/tobStudyMotCourseList.do'
};

export const updataStudyMotld=(ajaxParams)=>{
    return{
        ajaxParams
    }
}

export const loadData=(data, ajaxParams,type,list)=>{
    let result={ajaxParams}
    switch(type){
        case "refresh":
                result.studyMotName = data.body.studyMotName;
                result.smaImgUrl = data.body.smaImgUrl;
                result.list = data.body.courseArr;
            break;
        case "add":
                result.studyMotName = data.studyMotName;
                result.smaImgUrl = data.smaImgUrl;
                result.list = [...list, ...data.body.courseArr];
            break;
    }
    return{
        ...result
    }
}

export const updateScrollTop=(top)=>{
    return{
        scrollTop:top
    }
}