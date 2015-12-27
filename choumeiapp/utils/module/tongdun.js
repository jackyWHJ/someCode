/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-08-22 10:30:25
 * @version $Id$
 * @required jquery seajs
 */
/*
 *同盾
 */
define(["jquery","commonUtils"],function($,commonUtils){
    var sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = $.trim(new Date().getTime() + Math.round(Math.random() * 10000));
        sessionStorage.setItem("sessionId", sessionId);
    }
    if (env == "dev" || env == "test") {
        window._fmOpt = {
            partner: 'choumei',
            appName: 'choumei_web',
            token: sessionId,
            fpHost: 'https://fptest.fraudmetrix.cn',
            staticHost: 'statictest.fraudmetrix.cn',
            tcpHost: 'fptest.fraudmetrix.cn',
            wsHost: 'fptest.fraudmetrix.cn:9090'
        }
    } else {
        window._fmOpt = {
            partner: 'choumei',
            appName: 'choumei_web',
            token: sessionId,
            fpHost: 'https://fp.fraudmetrix.cn',
            staticHost: 'static.fraudmetrix.cn',
            tcpHost: 'fp.fraudmetrix.cn',
            wsHost: 'fp.fraudmetrix.cn:9090'
        }
    }
    var  cimg  =  new  Image(1, 1);
    cimg.onload  =   function()  {
        window._fmOpt.imgLoaded  =  true;
    };
    cimg.src  =  window._fmOpt.fpHost + "/fp/clear.png?partnerCode=choumei&appName=choumei_web&tokenId="  +  window._fmOpt.token;
    cimg.src = cimg.src.replace('$partnerCode',window._fmOpt.partner).replace('$appName', window._fmOpt.appName);
    var fm = document.createElement('script');
    fm.type = 'text/javascript';
    fm.async = true;
    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + window._fmOpt.staticHost + '/fm.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fm, s);
    var user = JSON.parse(window.sessionStorage.getItem("user") || window.localStorage.getItem("user"));
    var mobilephone = "";
    if (user) {
        mobilephone = user.mobilephone;
    }
    window.tongdun = function(setting) {
        commonUtils.request({
            url: apiConfig.newApi+"anti/" + setting.url + "?randomCode=" + Math.round(Math.random() * 1000),
            data: $.extend({
                mobilePhone: mobilephone,
                token: sessionId
            }, setting.data)
        })
    }
});