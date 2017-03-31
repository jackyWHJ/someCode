import {ExamIntroductionUrl as URL} from './ActionType';

export const updateData = (data)=>{
    return {
        examIntroduction : data,
    }
};
export const updateUserInfo = (data)=>{
    return {
        userInfo : data,
    }
};
export const getExamIntroduction = (params)=>{
    const setting = {
        url:URL.getIntroduction,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(updateData(data.body));
        }else{
            dispatch(updateData(null));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(updateData(null));
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