
export const loadData = (list, ajaxParams) => {
    return {
        list,
        ajaxParams,
    }
}

export const saveAjaxParams=(ajaxParams)=>{
    return {ajaxParams}
}

export const updateScrollTop = (scrollTop) => {
    return {
        scrollTop
    }
}

/*export const clearAll = (obj) => {
    console.log(obj);
    return {
        list:[],
        ajaxParams: {
            courseType: "M",
            isCompleted: "0",
            isObligatory:"Y",   //����"Y",ѡ��"N"
        },
        scrollTop: 0,
    }
}*/
