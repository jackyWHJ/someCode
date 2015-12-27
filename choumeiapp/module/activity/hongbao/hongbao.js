/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-10-19 14:09:03
 * @version $Id$
 */
define(["jquery", "commonUtils", 'jquery.lazyLoad'], function($, commonUtils) {
    return function() {
        // $("#resultPage,.ticketWrap").show();
        // return;
        var locate = location.toString().substring(0, location.toString().indexOf("module/"));
        var orderTicketId = commonUtils.getQueryString("orderTicketId");
        var hongbaoResultKey = "hongbao-result-" + orderTicketId;
        var hongbaoUserInfoKey = "hongbao-userInfo";
        if (commonUtils.getQueryString("noCache")) {
            localStorage.removeItem(hongbaoResultKey);
            localStorage.removeItem(hongbaoUserInfoKey)
        }
        var hongbaoResult = JSON.parse(localStorage.getItem(hongbaoResultKey)) || {
            mobilephone: null,
            getResulted: false,
            orderTicketId: orderTicketId,
            result: {
                laiseeList: null,
                laiseeStatus: null
            }
        };
        var hongbaoUserInfo = JSON.parse(localStorage.getItem(hongbaoUserInfoKey)) || {
            mobilephone: null,
            nickName: null,
            imgURL: null,
            openIdEncrypt: null
        };
        var requestResultData = {
            orderTicketId: orderTicketId,
            mobilephone: commonUtils.getQueryString("mobilephone"),
            result: {
                laiseeStatus: commonUtils.getQueryString("laiseeStatus"),
                laiseeList: JSON.parse(commonUtils.getQueryString("laiseeList")),
                postNickname: commonUtils.getQueryString("postNickname"),
                postImg: commonUtils.getQueryString("postImg")
            }
        };
        var requestUserData = {
            mobilephone: commonUtils.getQueryString("mobilephone"),
            nickName: commonUtils.getQueryString("nickName"),
            imgURL: commonUtils.getQueryString("imgURL"),
            openIdEncrypt: commonUtils.getQueryString("openIdEncrypt")
        }
        if (requestResultData.result.laiseeStatus !== null) { //这里会在url后传回用户的相关信息
            hongbaoResult.result.getResulted = true;
            $.extend(true, hongbaoResult, requestResultData);
            localStorage.setItem(hongbaoResultKey, JSON.stringify(hongbaoResult));
            $.extend(true, hongbaoUserInfo, requestUserData);
            localStorage.setItem(hongbaoUserInfoKey, JSON.stringify(requestUserData));
        }
        // alert(location.search+",   "+JSON.stringify(data));
        // alert(location.search+",   "+JSON.stringify(hongbaoResult));
        //return;
        if (hongbaoUserInfo.mobilephone != hongbaoResult.mobilephone) { //两个手机号码不一样,证明手机号码被修改过
            if (hongbaoUserInfo.mobilephone) {
                mobilephone = hongbaoUserInfo.mobilephone;
            } else {
                mobilephone = hongbaoResult.mobilephone;
            }
            getResultByPhone();
        } else {
            if (!hongbaoResult.result.getResulted) { //没拉过结果时
                location = apiConfig.newApi + "laisee/get-laisee-by-wechat.html?request={'orderTicketId':'" + orderTicketId + "','mobilephone':'" + hongbaoUserInfo.mobilephone + "'}&h5_redirect_url=" + locate + "/module/activity/hongbao/result.html?orderTicketId=" + orderTicketId;
                return;
            }
            route(hongbaoResult.result);
        }

        function route(data) {
            //laiseeStatus  string 0:正常 1:红包过期，2：红包已经领完，3：用户不存在，4：活动失效，5：已经抢过
            switch (data.laiseeStatus) {
                case "1":
                    showEndPage();
                    break;
                case "2":
                    showNoTicketPage();
                    break;
                case "3":
                    showInputPhonePage();
                    break;
                case "4":
                    showFailPage();
                    break;
                case "5":
                    showResultPage(data);
                    break;
                case "0":
                    showResultPage(data);
                    break;
            }
        } //end route
        (function initPasge() {
            commonUtils.showLoading();
        })();

        function resetPage() {
            $("#resultTip").css("visibility", "hidden");
            $("#useTicket,#inputPhoneOuterWrap,#noTicket,#noTicket-accountTip,#accountInfo,#help").hide();
            $("#resultPage").show();
            commonUtils.hideLoading();
        }

        function showEndPage() {
            resetPage();
            $("#end").show();
        }

        function showNoTicketPage() {
            resetPage();
            $("#noTicket").show();
            $("#noTicket-accountTip").show();
        }

        function showInputPhonePage() {
            resetPage();
            if (hongbaoResult.result.postNickname != "臭美") {
                $("logo").attr("src", hongbaoResult.result.postImg || "images/cmlogo.png");
                $("#resultTip .getTicketTip").html("<span class=\"bigger\">我是" + (hongbaoResult.result.postNickname || "臭美") + "</span><br />恭喜你抢到了我的现金券，下次美发试试臭美呗！");
            }
            $("#resultTip").css("visibility", "visible");
            $("#inputPhoneOuterWrap").show();
        }

        function showFailPage() {
            location = "fail.html";
        }

        function showResultPage(data) {
            resetPage();
            $("#resultTip").css("visibility", "visible");
            var htmlStr = [];
            $("#accountInfo,#useTicket,#help").show();
            if (data.postNickname != "臭美") {
                $("logo").attr("src", data.postImg || "images/cmlogo.png");
                $("#resultTip .getTicketTip").html("<span class=\"bigger\">我是" + data.postNickname + "</span><br />恭喜你抢到了我的现金券，下次美发试试臭美呗！");
            }
            $.each(data.laiseeList, function(key, val) {
                htmlStr.push("<div class=\"ticketWrap\"><div class=\"ticket resultTicket \"><span class=\"typeWrap\"><span class=\"ticketType\">现金券</span><br /><span class=\"itemType\">");
                htmlStr.push(val.type);
                htmlStr.push("</span></span><span class=\"price\">");
                htmlStr.push(val.value);
                htmlStr.push("<span class=\"unit\">元</span></span>");
                htmlStr.push("</div><img src=\"images/ticket.png\" alt=\"券\" class=\"ticketImg\" /></div>");
            })
            $("#ticketList").prepend(htmlStr.join(""));
            $("#ticket-phone").html(hongbaoResult.mobilephone);
        }
        $("#getTicketBtn").on("click", function() {
            mobilephone = $("#input-phone").val();
            if (/^1\d{10}$/.test(mobilephone)) {
                $("#ipnut-phoneWrap").removeClass('error');
                getResultByPhone();
            } else {
                $("#ipnut-phoneWrap").addClass('error');
            }
        })

        function getResultByPhone() {
            commonUtils.request({
                data: {
                    orderTicketId: orderTicketId,
                    mobilephone: mobilephone || hongbaoUserInfo.mobilephone,
                    imgURL: hongbaoUserInfo.imgURL,
                    nickName: hongbaoUserInfo.nickName,
                    openIdEncrypt: hongbaoUserInfo.openIdEncrypt,
                    h5_redirect_url: locate + "/module/activity/hongbao/result.html?orderTicketId=" + orderTicketId
                },
                url: apiConfig.newApi + "laisee/get-laisee-by-mobilephone.html",
                successCallback: function(data) {
                    if (data.code != 0) {
                        commonUtils.alert(data.message);
                        return;
                    }
                    $("#inputPhoneOuterWrap").hide();
                    hongbaoUserInfo.mobilephone = mobilephone;
                    hongbaoResult.mobilephone = mobilephone;
                    hongbaoResult.result = data.response;
                    hongbaoResult.result.getResulted = true;
                    localStorage.setItem(hongbaoResultKey, JSON.stringify(hongbaoResult));
                    localStorage.setItem(hongbaoUserInfoKey, JSON.stringify(hongbaoUserInfo));
                    route(data.response);
                    getHistory(); //刷新历史
                }
            });
        }

        function getHistory() {
            commonUtils.request({
                data: {
                    orderTicketId: orderTicketId
                },
                url: apiConfig.newApi + "laisee/get-laisee-list.html",
                successCallback: renderHistory
            });
        }
        getHistory();

        function renderHistory(data) {
            if (data.code == 0) {
                var tmpStr = [];
                $.each(data.response.laiseeList, function(key, val) {
                    tmpStr.push("<dd><img src=\"images/default_img.png\" alt=\"用户头像\" class=\"head lazy\" data-original=" + val.imgURL);
                    tmpStr.push(" /><div class=\"info\"><div class=\"con\"><div class=\"name\">" + val.nickName);
                    tmpStr.push("</div><p class=\"msg\">" + val.laiseeComment);
                    tmpStr.push("</p><div class=\"time\">" + val.getTime);
                    tmpStr.push("</div></div><div class=\"price\">" + val.value);
                    tmpStr.push("元</div></div></dd>")
                });
                $("#historyList dd").remove();
                $("#historyList").append(tmpStr.join(""));
                $("img.lazy").removeClass("lazy").lazyload({
                    effect: "fadeIn"
                });
            }
        }
        $("#changePhone").on("click", function() {
            renderChangePhonePage();
        })

        function renderChangePhonePage() {
            $("#changePhonePage").show();
            $("#resultPage").hide();
            $("#currentPhone").html(hongbaoResult.mobilephone);
        }
        $("#changePhoneBtn").on("click", function() {
            var mobilephone = $("#change-input-phone").val();
            if (/^1\d{10}$/.test(mobilephone)) {
                $("#changePhoneWrap").removeClass('error');
                hongbaoUserInfo.mobilephone = mobilephone;
                hongbaoResult.result.laiseeList = null;
                localStorage.setItem(hongbaoResultKey, JSON.stringify(hongbaoResult));
                localStorage.setItem(hongbaoUserInfoKey, JSON.stringify(hongbaoUserInfo));
                commonUtils.showTip("手机号修改成功<br />下次抢红包将会放入已修改的手机号");
                $("#changePhonePage").hide();
                $("#resultPage").show();
            } else {
                $("#changePhoneWrap").addClass('error');
            }
        })
        //weixing share
        var wxShare = {
            shareTimelineData: {
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                link: window.location.href.split("#")[0],
                imgUrl: "http://" + window.location.host + "/module/sf/img/share.png",
                trigger: function(res) {
                    //alert('用户点击分享到朋友圈');
                },
                success: function(res) {
                    //commonUtils.alert('已分享到朋友圈');
                },
                cancel: function(res) {
                    //commonUtils.alert('已取消分享到朋友圈');
                },
                fail: function(res) {
                    //commonUtils.alert('分享到朋友圈失败！');
                }
            },
            shareAppMessageData: {
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                desc: '良辰最喜欢对那些跟我关系好的人出手了，拯救你们的发型，就用臭美App！', // 分享描述
                link: window.location.href.split("#")[0],
                imgUrl: "http://" + window.location.host + "/module/sf/img/share.png",
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                trigger: function(res) {
                    //alert('用户点击分享到朋友');
                },
                success: function() {
                    // 用户确认分享后执行的回调函数
                    //commonUtils.alert('已分享到朋友');
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    //commonUtils.alert('已取消分享到朋友');
                },
                fail: function() {
                    //commonUtils.alert('分享到朋友失败！');
                }
            },
            initData: function(data) {
                wxShare.shareAppMessageData.title = wxShare.shareTimelineData.title = data.wechatTitle;
                wxShare.shareAppMessageData.link = wxShare.shareTimelineData.link = data.h5URL;
                wxShare.shareAppMessageData.imgUrl = wxShare.shareTimelineData.imgUrl = data.imgURL;
                wxShare.shareTimelineData.desc = data.wechatContent;
            },
            wxCallback: function(config) {
                if (wx) {
                    wx.config({
                        debug: false,
                        appId: config.appId,
                        timestamp: config.timestamp,
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function() {
                        wx.checkJsApi({
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                // 以键值对的形式返回，可用的api值true，不可用为false
                                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                                var result;
                                if (typeof res == "string") {
                                    result = $.parseJSON(res);
                                } else if (typeof res == "object") {
                                    result = res;
                                }
                                if (result.checkResult.onMenuShareTimeline) {
                                    wx.onMenuShareTimeline(wxShare.shareTimelineData);
                                } else {
                                    commonUtils.alert("分享到朋友圈功能不可用！");
                                }
                                if (result.checkResult.onMenuShareAppMessage) {
                                    // 2.3 监听“分享到朋友”按钮点击、自定义分享内容及分享结果接口
                                    wx.onMenuShareAppMessage(wxShare.shareAppMessageData);
                                } else {
                                    commonUtils.alert("分享给朋友功能不可用！");
                                }
                            },
                            fail: function() {}
                        });
                    });
                    wx.error(function(res) {
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    });
                }
            }
        };
        var getWxConfigData = function() {
            var data = {
                to: 'signPackage',
                type: 'Wechat',
                body: {
                    url: window.location.href.split("#")[0]
                }
            }
            commonUtils.ajaxRequest({
                data: data,
                successCallback: function(data) {
                    if (data.result == 1) {
                        var config = data.data.main;
                        wxShare.wxCallback(config);
                    } else {
                        commonUtils.alert(data.msg);
                    }
                },
                url: apiConfig.userApi
            });
        };
        getWxConfigData();
        commonUtils.request({
            data: {
                orderTicketId: orderTicketId
            },
            successCallback: function(data) {
                if (data.code == 0) {
                    wxShare.initData(data.response);
                    //配置banner
                    var bannerURL = data.response.bannerURL;
                    if (bannerURL) {
                        $("#banner").attr("src", bannerURL);
                    }
                } else {
                    commonUtils.showTip(data.message);
                    if (data.code == 23004) {
                        location = "fail.html";
                    }
                }
            },
            url: apiConfig.newApi + "laisee/get-laisee-info.html"
        });
    }
})