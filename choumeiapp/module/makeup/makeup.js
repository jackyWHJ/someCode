/**
 * Created by zhaoheng on 2015/12/7 11:18.
 * Last Modified by zhaoheng on 2015/12/7 11:18.
 */
define(['jquery', 'commonUtils'], function($, commonUtils){

    var share = function( info ){

        $.ajax({
            url:  apiConfig.userApi,
            method: "POST",
            data: {code: JSON.stringify({
                to: 'signPackage',
                type: 'Wechat',
                body: {url:  window.location.href.split("#")[0]}
            })},
            success: function (data) {

                data = $.parseJSON(data);
                if (data.result != 1) {
                    commonUtils.alert(data.msg);
                } else {
                    config = data.data.main ;
                    //console.dir( config );
                    if( info ){
                        wxCallback( config, info );
                    }
                }

            },
            error: function (xhr, status) {
                var message = "数据请求失败，请稍后再试!";
                if (status === "parseerror") message = "响应数据格式异常!";
                if (status === "timeout")    message = "请求超时，请稍后再试!";
                if (status === "offline")    message = "网络异常，请稍后再试!";
            }
        });

        $(".share").on("click", function(e){
            $('body').append( '<div id="share-wrap"><img src="../../images/12_a.png"><br /><img src="../../images/12_b.png"></div>' );
            $("#share-wrap").unbind().bind("click", function(e){$(this).remove()});
        });
    };

    function wxCallback ( config, data ){

        if( wx ){

            wx.config({
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','chooseImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function(){

                wx.checkJsApi({
                    jsApiList: ['chooseImage', 'onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function(res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                        var result;
                        if( typeof res == "string"){
                            result = $.parseJSON( res );
                        }else if( typeof  res == "object" ){
                            result = res;
                        }

                        if( result.checkResult.onMenuShareTimeline ){

                            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                            wx.onMenuShareTimeline({
                                title: data.title,
                                link: data.url,
                                imgUrl: data.icon,
                            });

                        }

                        if( result.checkResult.onMenuShareAppMessage ){

                            // 2.3 监听“分享到朋友”按钮点击、自定义分享内容及分享结果接口
                            wx.onMenuShareAppMessage({
                                title: data.title,
                                desc:  data.content, // 分享描述
                                link: data.url,
                                imgUrl: data.icon,
                                type: 'link', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            });

                        }

                    },
                    fail: function(){
                    }
                });

            });

            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });

        }

    };

    var title = function( title ){
        $(".back, #head-img .left-icon").on("click", function(){
            window.history.back();
        })
    };

    var makeUpCenter = function( isShare ){

        var page = {
            init: function(){

                page.render();

            },
            template: function( data ){

                var html = '', img = '<section class="grid-block">';

                $.map( data.centerInfo , function(object, key){

                    if( object.imgs.length > 1 ){
                        $.map( object.imgs, function(imgUrl, key){
                            img += '<img src="'+ imgUrl + '">';
                        });
                    }else{
                        if(object.imgs[0]){
                            img += '<img src="' + object.imgs[0] + '">';
                        }
                    }

                    html += '<section class="equipment-introduction"><h3 class="pink">' + object.title +
                        '</h3><p class="gray">' + replaceToNewline( object.content ) +
                        '</p>' + img + '</section></section>';

                    img = '<section class="grid-block">';

                });

                $("#makeUpCenter").append( html );

            },
            render: function( id ){

                commonUtils.request({
                    url: apiConfig.newApi + 'semipermanent/beautyCenter.html',
                    data :{},
                    successCallback: function( data ){

                        if( data.response ){
                            page.template( data.response );

                            if( isShare == true ){
                                share( data.response.share );
                            }
                        }

                        page.event();

                    }
                });

            },
            event: function(){
                map();
            }
        }

        page.init();

    };

    var call = function(){
        $("#phone, #call-phone").on("click", function(){

            commonUtils.confirm( $("#phone-num").text(),
                {
                    cancelButtonText: '取消',
                    okButtonText: "呼叫"
                }
            );

            $("#confirm_ok_button").append( '<a href="tel:' + $("#phone-num").text().replace(/-/g, "") + '"></a>' );

        });
    };

    var appointment = function(){
        $(".call-immediately").on("click", function(){
            window.location = "../appoint/appoint.html?itemId=" + commonUtils.getQueryString( "itemId" );
        });
    };

    var map = function(){
        $(".makeup-center").on("click", function(e){
            window.location = "http://api.map.baidu.com/marker?location=" + '22.546785' + "," + '113.962437' +
                "&title=" + '臭美（深圳）韩式定妆中心' + "&content=" + '南山区华润城，大冲商务中心C座6楼' + "&output=html&src=臭美"
        });
    };

    var replaceToNewline = function( val ){
        if( typeof val == "string" ){
            return val.replace( /\n+/g, '<br/>' );
        }else{
            return val;
        }
    };

    //图片高度重置
    var imgResize = function(obj){
        var imgdiv = obj.imgdiv;
        var imgwidth=obj.imgwidth;
        var biliw = obj.biliw;
        var bilih = obj.bilih;
        var imgheight = bilih*imgwidth/biliw;
        obj.imgdiv.height(imgheight);
    };

    return {
        share: share,
        title: title,
        makeUpCenter: makeUpCenter,
        call: call,
        appointment: appointment,
        map: map,
        replaceToNewline : replaceToNewline,
        imgResize: imgResize
    }
})