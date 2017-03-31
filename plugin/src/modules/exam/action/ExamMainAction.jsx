import {ExamListUrl as URL} from './ActionType';

export const loadFormalData = (list, ajaxParams) => {
    return {
        formalExamList:list,
        formalAjaxParams:ajaxParams,
    }
};
export const loadSimulationData = (list, ajaxParams) => {
    return {
        simulationExamList:list,
        simulationAjaxParams:ajaxParams,
    }
};

export const updateFormalScrollTop = (scrollTop) => {
    return {
        formalScrollTop:scrollTop
    }
};

export const updateSimulationScrollTop = (scrollTop) => {
    return {
        simulationScrollTop:scrollTop
    }
};

export const setResultMain = (result)=>{
    return {
        examResult : result,
    }
};
export const submitExamDetailsMain = (params)=>{
    const setting = {
        url:URL.submitExamDetails,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(setResultMain(data.body));
        }else{
            dispatch(setResultMain(data.message));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(setResultMain('提交失败！'));
    };
    return fetchData(setting,done,fail);
};
/*
const updateData = (result)=>{
    return {
        examList : result,
    }
};
export const setIsSuccess = (status)=>{
    return {
        isSuccess : status,
    }
};
export const updateFormalExamList = (formalExamList)=>{
    return {
        formalExamList : formalExamList,
    }
};
export const updateSimulationExamList = (simulationExamList)=>{
    return {
        simulationExamList : simulationExamList,
    }
};

export const getExamList = (params,type)=>{
    const setting = {
        url:type=='F'?URL.getFormalExamList:URL.getSimulationExamList,
        params:params,
    }
    const done = (data, dispatch) => {
        if (data.code == '0') {
            dispatch(updateData(data.body.examArr));
            dispatch(setIsSuccess('success'));
        }else{
            dispatch(updateData([]));
            dispatch(setIsSuccess(data.message));
        }
    };
    const fail = (msg, dispatch) => {
        dispatch(updateData([]));
        dispatch(setIsSuccess('获取数据失败！'));
    };
    return fetchData(setting,done,fail);
};
*/
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


export const setShowTab = showTab => {
    return {showTab}
};