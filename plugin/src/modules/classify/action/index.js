import { Toast } from 'antd-mobile';

import $ from 'n-zepto';
import 'zepto/src/callbacks.js';
import 'zepto/src/deferred.js';
import courseObserve from '../../../common/utils/courseObserve';

export const queryCourseDetail = (params,successFunc) => {
    return dispatch => {
        Toast.loading('加载中...', 0);
        Ajax({ 
            // url: "http://localhost:8000/modules/classify/constant/courseDetail.json",
            url: '/learn/app/clientapi/course/queryCourseDetail.do', 
            data: {
                nonGzip: 1,
                pageType: "plugin",
                umId: '',
                ver: Util.getVersion(),
                sid: Util.storage.getSid(),
                ...params
            },
            success(data) {
                Toast.hide();

                if (data.code == 0) {
                    successFunc(data.body);
                    dispatch( dataAdapter(data) );
                } else {
                    Toast.info(data.message, 3);
                }
            },
            error(xhr, type) {
                Toast.hide();
            }
        });
    }
}

const dataAdapter = function dataAdapter( data ) {
    if (data && data.body) {
        const result = {};

        result.course = data.body;
        return result;
    }

    return {};
};

export const submitMark = (params, success, fail) => {
    return dispatch => {
        Ajax({
            url: '/learn/app/clientapi/course/courseRating.do',
            data: {
                nonGzip: 1,
                pageType: "plugin",
                umId: '',
                ver: Util.getVersion(),
                sid: Util.storage.getSid(),
                ...params
            },
            success(data) {
                if (data.code == 0) {
                    // courseObserve.trigger(dispatch,{...course, isRated: 'Y'});
                    success(data);
                } else {
                    fail(data);
                }
            },
            error(error) {
                fail(error);
            }
        })
    }
};

export const submitCompleted = (params, success, fail) => {
    return dispatch => {
        Ajax({
            // url: '/learn/app/clientapi/course/uploadCourseLearnStatus.do',
            url: '/learn/app/clientapi/course/uploadLearnFlag.do',
// courseId=6d4c9bbd73b448e0a92cfd7bc19f6c0b&nonGzip=1&sid=9ABB4951BE484865A2FD1731F6CF2C25&time=2017-3-10+11:34:26&umId=
            data: {
                nonGzip: 1,
                pageType: "plugin",
                umId: '',
                ver: Util.getVersion(),
                sid: Util.storage.getSid(),
                // time: '2017-3-10+11:34:26',
                ...params
                // courseId: '77d64cb0f6d04b66a9b36e1461162e48'
            },
            success(data) {
                if (data.code == 0) {
                    
                    success(data);
                } else {
                    fail(data);
                }
            },
            error(error) {
                fail(error);
            }
        })
    }
};

// typeModuleList.do
export const requestTypeModuleList = (params) => {
    return dispatch => {
        Toast.loading('加载中...', 0);

        Ajax({ 
            url: '/learn/app/clientapi/course/typeModuleList.do', 
            data: {
                nonGzip: 1,
                pageType: "plugin",
                umId: '',
                ver: Util.getVersion(),
                sid: Util.storage.getSid(),
                cateId: Util.storage.getHomeId(),
                ...params
            },
            success(data) {
                Toast.hide();

                if (data.code == 0) {
                    dispatch( dataAdapterFormodule(data) );
                } else {
                    Toast.info(data.message, 3);
                }
            },
            error(xhr, type) {
                Toast.hide();
            }
        });
    }
}

const dataAdapterFormodule = function( data ) {
    if (data && data.body) {
        const result = {};

        result.body = data.body;
        return result;
    }

    return {};
};

export const updateCourseDetail = (course) => {
    return {
        course
    }
}



export const triggerCourseDetail = (course) => {
    return (dispatch) => {
        courseObserve.trigger(dispatch, course);
    }
}



