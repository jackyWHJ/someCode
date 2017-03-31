
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

export const clearAll = (obj) => {
    //console.log(obj);
    let isCom = "1";
    if(obj=="hasLearn"){
        isCom="1";
    }else if(obj=="notLearn"){
        isCom="0";
    }
    return {
        list:[],
        ajaxParams: {
            courseType: "M",
            isCompleted: isCom,
            isObligatory:"Y",   //±ØÐÞ"Y",Ñ¡ÐÞ"N"
        },
        scrollTop: 0,
    }
}