
export const changeTab = (activeKey) => {
    return {
        activeKey,
    }
}

export const saveAjaxParamsHasLearn=(ajaxParamsHas)=>{
    return {ajaxParamsHas}
}

export const saveAjaxParamsNotLearn=(ajaxParamsNot)=>{
    return {ajaxParamsNot}
}


export const loadDataHasLearn = (listHas, ajaxParamsHas) => {
    return {
        listHas,
        ajaxParamsHas,
    }
}


export const updateScrollTopHasLearn = (scrollTopHas) => {
    return {
        scrollTopHas
    }
}



export const loadDataNotLearn = (listNot, ajaxParamsNot) => {
    return {
        listNot,
        ajaxParamsNot,
    }
}


export const updateScrollTopNotLearn = (scrollTopNot) => {
    return {
        scrollTopNot
    }
}