/**
 * Created by zhaoheng on 2015/7/6 15:34.
 * Last Modified by zhaoheng on 2015/7/6 15:34.
 */


$("#num").on("keyup", function (e) {

    if ($(this).hasClass("has-error")) {
        $(this).removeClass("has-error");
    }

});

$(document).on('keyup',function(e){
    if(e.keyCode === 13){
        submit( e );
    }
});

$("#query").on("click", function (e) {
    submit( e );
});


function submit( event ){
    var num = $("#num"), numVal = num.val();

    if (commonUtils.isPhone(numVal)) {

        $.ajax({
            url: apiConfig.userApi,
            method: "POST",
            data: {code: JSON.stringify({to: 'valiInviteCode', type: 'Activity', body: {mobilephone: numVal}})},
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
                    var html = '<div class="row"><span class="column small-6">手机号码：</span><span class="column small-6"> ' + num.val() +
                        '</span></div><div class="row" style="margin-top: 20%;"><span class="column small-12" style="text-align: center;">无结果</span></div>';
                    $(".content").html(html);
                } else {

                    var r = data.data.main;
                    var radio = ( r.receivedPrize == "1" ? true : false );

                    if ( r.register == 2 ) {
                        var html = '<p style="font-size:13px">当前用户 ' + r.mobilephone +  ' 查询无结果</p>'
                        $(".content").html(html);

                    } else if ( r.register == 1 ) {


                        var html =  '<table><tbody><tr><td>手机号码' + '</td><td>' + r.mobilephone + '</td></tr>' +
                                    '<tr><td>账号注册时间' + '</td><td>' + r.addTime  + '</td></tr>' +
                                    '<tr><td>商家邀请码' + '</td><td>' + r.recommendSalon  + '</td></tr>' +
                                    '<tr><td>活动邀请码' + '</td><td>' + r.recommendActivity  + '</td></tr>' +
                                    '<tr><td>集团邀请码' + '</td><td>' + r.companyInfo  + '</td></tr>' +
                                    '<tr><td>首单支付时间' + '</td><td>' + r.firstTime  + '</td></tr>' +
                                    '<tr><td>首单消费时间' + '</td><td>' + r.useTime  + '</td></tr>' +
                                    '<tr><td>首单退款时间' + '</td><td>' + r.refundTime  + '</td></tr>' +
                                    '<tr><td>首单应付金额' + '</td><td>' + r.priceall  + '</td></tr>' +
                                    '<tr><td>代金券面额' + '</td><td>' + r.voucherMoney  + '</td></tr>' +
                                    //'<tr><td>代金券编号' + '</td><td>' + r.voucherSn  + '</td></tr>' +
                                    '<tr><td>支付方式' + '</td><td>' + r.payType  + '</td></tr>' +
                                    '<tr><td>首单实付金额' + '</td><td>' + r.actuallyPay  + '</td></tr>' +
                                    //'<tr><td>首单臭美卷密码' + '</td><td>' + r.ticketno  + '</td></tr>' +
                                    '<tr><td>首单购买店铺' + '</td><td>' + r.salonName  + '</td></tr>' +
                                    '<tr><td>首单购买项目' + '</td><td>' + r.itemName  + '</td></tr>' +
                                    '<tr><td colspan="2">' +
                                    '<div class="radio"><span class=""><span class="' + ( radio ? "fui-check check" : "fui-check " ) +
                                    '"></span></span><span class="">是否已经领过奖品（勾选后无法取消）</span>' +
                                    '</span></div>' +
                                    '</div>' + '</td></tr>' +
                                    '</tbody></table>'

                            ;
                        $(".content").html(html);
                        if (!$(".fui-check").hasClass("check")) {
                            $(".radio").off().on("click", function (e) {


                                commonUtils.confirm("确定已经领取奖品", {}, function (status) {
                                    if (status) {
                                        $.ajax({
                                            url: apiConfig.userApi,
                                            method: "POST",
                                            data: {
                                                code: JSON.stringify({
                                                    to: 'receivePrize',
                                                    type: 'Activity',
                                                    body: {mobilephone: r.mobilephone, recommendCode: r.recommendCode}
                                                })
                                            },
                                            beforeSend: function () {
                                                if ($("#loadingDiv").length == 0) {
                                                    var html = '<div id="loadingDiv"><div><img src="../../../css/images/ajaxloader.gif"><p>努力加载中...</p></div></div>';
                                                    $(html).appendTo($('body'));
                                                }
                                                $("#loadingDiv").show();
                                            },
                                            success: function (data) {
                                                data = $.parseJSON(data);
                                                $("#loadingDiv").fadeOut("fast");
                                                if (data.result == 1) {
                                                    $(".radio").off().find(".fui-check").addClass("check");
                                                } else {
                                                    commonUtils.alert( "手机号码或激活码有误!" );
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
                                        });
                                    }
                                })

                            })
                        }
                    }
                }

                $(".normal-query").hide().addClass("result-query").removeClass("normal-query").show();
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

        commonUtils.alert("手机号码格式不正确", {}, function () {
            num.focus();
            num.addClass("has-error");
            $(".content").html("");
        });

    }
}