import { Toast } from 'antd-mobile';

//保存当前选择的tab
export const saveActive=(index)=>{
    return {activeKey:index}
}

export const updataActive=(key)=>{
    return {activeKey:key}
}
