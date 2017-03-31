import {ExamResultUrl as URL} from './ActionType';

const updateData = (data)=>{
    return {
        examResult : data,
    }
};

export const getExamResult = (params)=>{
    const setting = {
        url:URL.getExamResult,
        params:params,
    };
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


const fetchData = (setting, success, fail) =>{
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