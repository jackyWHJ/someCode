import {ExamDetailsUrl as URL} from './ActionType';

export const updateData = (data)=>{
    return {
        examDetails : data,
    }
};
export const setExamType = (examType)=>{
    return {
        examType : examType,
    }
};
export const setResult = (result)=>{
    return {
        examResult : result,
    }
};
export const setRecord = (record)=>{
    return {
        examRecord : record,
    }
};
export const setTime = (remainTime)=>{
    return {
        remainTime : remainTime,
    }
};


export const submitExamDetails = (params)=>{
    const setting = {
        url:URL.submitExamDetails,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(setResult(data.body));
        }else{
            dispatch(setResult(data.message));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(setResult('提交失败！'));
    };
    return fetchData(setting,done,fail);
};

export const getTime = (params)=>{
    const setting = {
        url:URL.getTime,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(setTime(data.body.remainSeconds));
        }else{
            dispatch(setTime(data.message));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(setTime('提交失败！'));
    };
    return fetchData(setting,done,fail);
};

export const getExamDetails = (params,type,examType)=>{
    let url = '';
    if(type==0){
        url = URL.getErrorQuestion;
    }else if(type==1){
        url = URL.getErrorList;
    }else{
        url = URL.getExamDetails;
    }
    const setting = {
        url:url,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(updateData(examType? {...data.body,examType}:data.body));
        }else{
            dispatch(updateData(data));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(updateData(data));
    };
    return fetchData(setting,done,fail);
};


export const getUserInfo = (params)=>{
    const setting = {
        url:URL.getUserInfo,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(updateUserInfo(data.body));
        }else{
            dispatch(updateUserInfo(null));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(updateUserInfo(null));
    };
    return fetchData(setting,done,fail);
};

const fetchData = (setting, success, fail) => {
    return dispatch => {
        Ajax({
            url: setting.url,
            data: setting.params,
            success(data) {
            if (success) {
                success(data, dispatch);
            }
            },
            error(msg, type) {
                if (fail) {
                    fail(msg, dispatch);
                }
            }
        });
    }
};