import { Toast } from 'antd-mobile';
import {API} from '../constant/rankAPI.jsx'
import $ from 'n-zepto';
import 'zepto/src/callbacks.js';
import 'zepto/src/deferred.js';
//console.log("$")
//console.log($);
//console.log($.Deferred);
//console.log($.ajax({}))

export const loadIndexData = (success) => {
    return dispatch => {
        Toast.loading('加载中...', 0);
        //let url_rank="http://localhost:8000/modules/rank/constant/rankTest1.json"; //API.indexDataAPI
        let url_rank= "/learn/app/rank.do";
        Ajax({
            url:url_rank,
            type: /json$/ig.test(url_rank)?"get":"post",//兼容模拟json请求
            data: {
                nonGzip: 1,//不压缩
                pageType: "plugin",
                pageId: Util.storage.getHomeId(),
                type: "course",
                sid: Util.storage.getSid()/*"266CD938200B4F7DAA9D0BE9C0B17548"*/
            },
            success(data){
                Toast.hide();
                if (data.code == 0) {
                    dispatch( dataAdapter(data) );
                    success(data);
                } else {
                    Toast.info(data.message, 3);
                    dispatch({loading:false});
                }
            },
            error(error) {
                Toast.hide();
                Toast.fail("访问接口失败", 2);
                dispatch(changeStatus())
            }
        });
    }
}

//export const getCateName=()=>{
    /*return dispatch => {
        //let url_title = "http://localhost:8000/modules/rank/constant/rankTitle.json";
        let url_title= "/learn/app/clientapi/home/gotoSpecificPage.do";
        Ajax({
            url:url_title,
            type: /json$/ig.test(url_title)?"get":"post",//兼容模拟json请求
            data:{
                ver:Util.getVersion(),
                sid:Util.storage.getSid(),/!*"309F4B49CE6F465D92980159FFE702E7",*!/
                pageId:"rank_goodcourse",
                nonGzip: 1,//不压缩
                pageType: "plugin",
            },success(data){
                if(data.code==0){
                    let result={};
                    result.cateName=data.body.cateName;
                    dispatch( result )
                }
            },error(xhr, type){
                Toast.info("访问接口失败", 3);
                //Toast.hide();
            }
        })
    }*/
//}

const changeStatus=function(){
    return {loading:false};
}

const dataAdapter = function dataAdapter( data ) {
    if (data && data.body) {
        const result = {};

        result.style=data.body.type ;
        result.homePageNum = data.body.homePageNum;
        result.chartArr = data.body.chartArr;
        result.loading = false;
        return result;
    }

    return {};
};

export const updateScrollTop = (scrollTop) => {
    return {
        scrollTop
    }
}