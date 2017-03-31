import { Toast } from 'antd-mobile';

export const loadUserInfo=()=>{

    return dispatch => {
        //Toast.loading('加载中...', 0);
        //let url_userInfo="http://localhost:8000/modules/exam/container/user.json"; //API.indexDataAPI  clientapi/exam/
        let url_userInfo = "/learn/app/clientapi/exam/queryUserInfoByUmId.do";
        Ajax({
            url:url_userInfo,
            type: /json$/ig.test(url_userInfo)?"get":"post",//兼容模拟json请求
            data: {
                nonGzip: 1,//不压缩
                pageType: "plugin",
                sid: Util.storage.getSid()/*"266CD938200B4F7DAA9D0BE9C0B17548"*/
            },
            success(data){
                Toast.hide();
                if (data.code == 0) {
                    let result={}
                    result.userName = data.body.userName;
                    result.photo = data.body.photo;//data.body.photo;
                    if(result.photo==""){//
                        result.photo = "../../../img/default_user.png";
                    }
                    dispatch( result );
                } else {
                    Toast.info(data.message, 3);
                }
            },
            error(error) {
                Toast.hide();
                Toast.fail("访问接口失败", 2);
            }
        });
    }
}


export const loadExamInfo=(id)=>{

    return dispatch => {
        Toast.loading('加载中...', 0);
        //let url_ExamInfo="http://localhost:8000/modules/exam/container/exam.json"; //API.indexDataAPI  clientapi/exam/
        let url_ExamInfo = "/learn/app/clientapi/exam/queryHistoryExam.do";
        Ajax({
            url:url_ExamInfo,
            type: /json$/ig.test(url_ExamInfo)?"get":"post",//兼容模拟json请求
            data: {
                nonGzip: 1,//不压缩
                pageType: "plugin",
                sid: Util.storage.getSid(),/*"266CD938200B4F7DAA9D0BE9C0B17548"*/
                examId:id
            },
            success(data){
                Toast.hide();
                if (data.code == 0) {
                    let result={}
                    result.examName = data.body.examName||"";
                    result.examArr = data.body.examArr||[];
                    dispatch( result );
                } else {
                    Toast.info(data.message, 3);
                }
            },
            error(error) {
                Toast.hide();
                Toast.fail("访问接口失败", 2);
            }
        });
    }
}
