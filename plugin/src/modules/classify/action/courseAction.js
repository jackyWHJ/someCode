import { Toast } from 'antd-mobile';

export const loadData = (list, ajaxParams) => {
	return {
		list,
		ajaxParams,
	}
}

// attributeArrayList.do
export const requestAttributeArrayList = (params) => {
    return dispatch => {
        Toast.loading('加载中...', 0);
    //     let url_rank="http://localhost:8000/modules/classify/constant/attributeArrayList.json";
    //     $.ajax({
    //         url:url_rank,
    //         method: 'get',
    //         data: {
    //             pageId: "SY0005605",
    //             type: "course",
    //             sid: "266CD938200B4F7DAA9D0BE9C0B17548"
    //         }
    //     }).done((data) => {
    //         Toast.hide();
    //     if (data.code == 0) {
    //         dispatch( dataAdapterForAttribute(data) );
    //     } else {
    //         Toast.info(data.message, 3);
    //     }
    // }).fail((error) => {
    //     Toast.hide();
    //     dispatch(changeStatus())
    // });
    	Ajax({ 
            url: '/learn/app/clientapi/course/attributeArrayList.do', 
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
                    dispatch( dataAdapterForAttribute(data) );
                    // setTimeout(()=>dispatch( dataAdapterForAttribute(data) ),0);
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

const dataAdapterForAttribute = function( data ) {
    if (data && data.body) {
        const result = {};

        result.attrs = data.body;
        return result;
    }

    return {};
};

export const updateAjaxParams = function(ajaxParams){
	return {
		ajaxParams,
	}
}

export const updateScrollTop = (scrollTop) => {
    return {
        scrollTop
    }
}

