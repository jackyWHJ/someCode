import React from 'react';
import {ExamListUrl as URL} from './ActionType';

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
