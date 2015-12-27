/**
 * Created by zhaoheng on 2015/7/6 15:34.
 * Last Modified by zhaoheng on 2015/7/6 15:34.
 */

window.onload = function(){
    $("body").show();
    var height = $(window).height();
    var wrapHeight = $(".wrap").height();
    if( wrapHeight < height ){
        $(".bottom").height( height - wrapHeight  );
    }
}

$("#tel").on("keyup", function (e) {
    if ($(this).hasClass("has-error")) {
        $(this).removeClass("has-error");
    }
});

$("#tel").on("focus", function (e) {
    $(this).attr("type", "tel");
});

$("#tel").on("blur", function(e){
    $(this).attr("type", "text");
});

$(document).on('keyup',function(e){
    if(e.keyCode === 13){
        submit( e );
    }
});

$("#search").on("touchend", function (e) {
    submit( e );
});

function submit( event ){
    var num = $("#tel"), numVal = num.val(), data;

    num.blur();

    if (commonUtils.isPhone(numVal)) {

        var vcSnOld = commonUtils.getQueryString( "vcSnOld" );
        var vcSnNew = commonUtils.getQueryString( "vcSnNew" );

        if( !vcSnOld ){
            commonUtils.alert("活动编码有误");
            return false;
        }

        if( vcSnNew ){
            data = JSON.stringify({to: 'getVoucher', type: 'Activity', body: { mobilephone: numVal, vcSnOld: vcSnOld, vcSnNew: vcSnNew }});
        }else{
            data = JSON.stringify({to: 'getVoucher', type: 'Activity', body: { mobilephone: numVal, vcSnOld: vcSnOld}});
        }

        $.ajax({
            url: apiConfig.userApi,
            method: "POST",
            data: {code: data },
            beforeSend: function () {
                if ($("#loadingDiv").length == 0) {
                    var html = '<div id="loadingDiv"><div><img src="../../../css/images/ajaxloader.gif"><p>努力加载中...</p></div></div>';
                    $(html).appendTo($('body'));
                }
                $("#loadingDiv").show();
            },
            success: function (data) {
                $("#loadingDiv").fadeOut();
                data = $.parseJSON(data);
                if (data.result != 1) {
                    commonUtils.alert( data.msg );
                } else {
                    $("#money").text( data.data.main.useMoney  );
                    $("#phone").text( numVal );
                    setTimeout(function(){
                        $(".wrap").hide();
                        $(".ok").show();
                    },100);
                }
            },
            error: function (xhr, status) {
                $("#loadingDiv").hide();
                var message = "数据请求失败，请稍后再试!";
                if (status === "parseerror") message = "响应数据格式异常!";
                if (status === "timeout")    message = "请求超时，请稍后再试!";
                if (status === "offline")    message = "网络异常，请稍后再试!";
                commonUtils.alert(message);
            }
        })

    } else {
        commonUtils.alert("请输入有效的11位数号码", {}, function () {
            num.addClass("has-error").focus();
        });
    }
}