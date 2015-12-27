define(["jquery", "commonUtils", 'jquery.lazyLoad'], function($,commonUtils) {
    var utils = commonUtils,
        user = {},
        userId = "",
        salonId = 0,
        shopcartsn = "",
        orderSn = '',
        $headerTitle = $("#headerTitle"),
        $doc = $(document),
        $ticketList = $("#ticketList"),
        $point = $("#point"),
        $paySuccessTips = $("#paySuccessInfo"),
        $singleTicketAdded = $("#singleTicketAdded"),
        $serviceCall = $("#serviceCall"),
        $successPageInfo = $('#paySuccessInfo,#successTips'),
        $delayPageInfo = $('#payOvertimeInfo,#overtimeTips');
    var init = function () {
        user = utils.checkLogin();
        if (user) {
            userId = user.userId;
        }
        commonUtils.addMenu();
        getPaySuccessPageData();
        addFootBtnclickListener();
        /*
         *付款成功返回页面
         */
        history.pushState(null, "", "../salon/salonList.html");
        var firstTime = true;
        window.onpopstate = function (e) {
            if (!firstTime) {
                location = "../salon/salonList.html";
            }
            firstTime = false;
        }
        /*window.sessionStorage.setItem("buySuccess","true");*/
    };

    var initTipsFlow = function(){
        var targetValue = $paySuccessTips.parent().offset().top;
        $doc.on("scroll",function(){
            if ($doc.scrollTop() >= targetValue){
                $paySuccessTips.css({
                    "position": "fixed",
                    "top": "0px"
                })
            }else{
                $paySuccessTips.css({
                    "position": "relative"
                })
            }
        })
    }();
 
    /**
     * 获取付款成功数据
     * */
    var getPaySuccessPageData = function () {
        var status = utils.getQueryString("state"),
            msg = utils.getQueryString("msg");
        if (status == 1) {
            utils.alert(msg, function () {
                window.history.go(-3);
            });
            return;
        }
        shopcartsn = utils.getQueryString("shopcartsn");
        orderSn = utils.getQueryString("orderSn");
        if (!shopcartsn && !orderSn) {
            utils.alert("订单编号出错，请返回重新选择！");
            return;
        }
        getPaySuccessData();
    };

    /**
     * 获取付费成功信息
     * */
    var getPaySuccessData = function () {
        var data = {};
        if (shopcartsn) {
            data = {
                to: "requestTicket",
                type: "Shopcart",
                body: {
                    "userId": userId,
                    "shopcartsn": shopcartsn
                }
            };
        } else if (orderSn) {
            data = {
                to: "getTicket",
                type: "Order",
                body: {
                    "userId": userId,
                    "orderSn": orderSn
                }
            };
        }

        /*
        * fetch data 获取订单数据
         */
        utils.ajaxRequest({
            data: data,
            successCallback: function (data) {
                if (data.result) {
                    renderPaySuccessContent(data.data);
                } else {
                    if (orderSn) {
                        $headerTitle.text('支付成功');
                        $('#payOvertimeInfo,#overtimeTips').show();
                        var ticketListArr = [];
                        ticketListArr.push('<div class="clear" style="height: 15px;"></div>');
                        ticketListArr.push('<div class="oib-list">');
                        ticketListArr.push('<div class="oib-area"><span class="oib-label">订&nbsp;&nbsp;单&nbsp;&nbsp;号：</span><span class="order-no">' + orderSn + '</span></div>');
                        ticketListArr.push('<div class="oib-area"><span class="oib-label">商品名称：</span><span style="width: 75%;" class="text-overflow"></span>');
                        ticketListArr.push(' <div class="oip-rule"><span class="oipr-text"></span></div></div>');
                        ticketListArr.push('<div class="oib-area"><span class="oib-label">店铺名称：</span><span style="width: 75%;" class="text-overflow"></span></div>');
                        ticketListArr.push('</div>');
                        $ticketList.html(ticketListArr.join(''));
                    }
                    utils.alert(data.msg);
                    console.log("获取付款成功信息失败！" + data.msg);
                }
            },
            url: apiConfig.orderApi
        });
    };

    /**
     * 渲染付款成功页面
     * */
    var renderPaySuccessContent = function (data) {
        //渲染订单内容
        var mainData = data.main,
        ticketArr = [],
            ticket = {},
            addedServices = [],
            ticketListArr = [];
        var isSuccess = true;
        //购物车
        if (shopcartsn) {
            var haveTicket = data.other.haveTicket;
            if (haveTicket == 1) {
                //支付结果--成功
                showSuccessInfo();
            } else {
                //支付结果--超时
                showDelayInfo();
            }
        }
        if (mainData.ticketInfo){
            mainData.ticketInfo.addedService = mainData.addedService;
            ticketArr.push(mainData.ticketInfo)
        }else{
            ticketArr = mainData;
        }
        for (var i = 0, len = ticketArr.length; i < len; i++) {
            // ticket = ticketArr[i];
            ticket = ticketArr[i];
            addedServices = ticketArr[i].addedService;
            var ticketNoStr = ticket.ticketNo;
            //订单
            if (orderSn) {
                if (ticketNoStr != '') {
                    //支付结果--成功
                   showSuccessInfo();
                } else {
                    //支付结果--超时
                    showDelayInfo();
                }
            }
            ticketListArr.push('<div class="clear" style="height: 15px;"></div>');
            ticketListArr.push('<div class="oib-list">');
            if (ticketNoStr != '') {
                ticketListArr.push('<div class="oib-area"><span class="oib-label">臭&nbsp;&nbsp;美&nbsp;&nbsp;券：</span><span class="order-no">' + ticketNoStr.substr(0, 4) + "&nbsp;&nbsp;" + ticketNoStr.substr(4, 8) + '</span></div>');
            }
            ticketListArr.push('<div class="oib-area"><span class="oib-label">商品名称：</span><span style="width: 75%;" class="text-overflow">' + ticket.itemName + '</span>');
            ticketListArr.push(' <div class="oip-rule"><span class="oipr-text">' + (ticket.normsStr || "无规格") + '</span></div></div>');
            ticketListArr.push('<div class="oib-area" style="border-bottom:none"><span class="oib-label">店铺名称：</span><span style="width: 75%;" class="text-overflow">' + ticket.salonName + '</span></div>');
            if (ticket.useLimit) {
                ticketListArr.push('<div class="cart-item-area"><p class="cart-item-tips">消费限制：<span class="oib-label">' + ticket.useLimit + '</span></p></div>');
            }
            if (len > 1) {
                if ( addedServices && addedServices.length > 0  ) {
                    ticketListArr.push('<div class="oib-area addedServiceTip"><div class="title item-icon-right"><span class="oib-label">增值服务：</span><span style="width: 75%;" class="text-overflow">到店可享免费增值服务 ' + addedServices.length + '项</span><i class="icon icon-arrow-down animate"></i></div>');
                    ticketListArr.push( addedServerRender(addedServices) );
                    ticketListArr.push('</div>');
                }
            } else {
                if (addedServices && addedServices.length > 0) {
                    $singleTicketAdded.show().append(addedServerRender(addedServices));
                }
            }
            ticketListArr.push('</div>');
        }
        $ticketList.html(ticketListArr.join(''));
        if (len > 1){
            bindServiceTipEvent();
            $serviceCall.removeClass('stand-bg');
        }

        imglazyLoading();

        if (data.other.growth) {
            $point.text(data.other.growth);
        } else {
            $point.text(ticketArr[0].growth);
        }
    };

    var bindServiceTipEvent = function(){
        $(".addedServiceTip").on("click", function() {
            var $this = $(this);
            var icon = $this.find(".icon");
            var target = $this.children('.addedService');
            if (target.hasClass("slideDownIn")){
                target.addClass("slideDownOut").removeClass("slideDownIn");
            }else{
                target.removeClass("slideDownOut").addClass("slideDownIn")
            }
            if (!icon.hasClass("animate-rotate-180")) {
                icon.addClass("animate-rotate-180").removeClass("animate-rotate-0");
            } else {
                icon.addClass("animate-rotate-0").removeClass("animate-rotate-180");
            }
        })
    }

    var showSuccessInfo = function(){
        $headerTitle.text('购买成功');
        $successPageInfo.show();
    }

    var showDelayInfo = function(){
        $headerTitle.text('支付成功');
        $delayPageInfo.show();
    }
    var addedServerRender = function(dataList) {
        var tmp = [];
        tmp.push('<ul class="addedService">');
        var servicesLen = dataList.length;
        for (var i = 0; i < servicesLen; i++) {
            var tmpService = dataList[i];
            tmp.push('<li class="item-avatar">');
            tmp.push('<img class=\"avatar sl-img lazy\" src=\"../../images/default_salon.png\" data-original=\"' + tmpService.sLogo + '\" alt=\"臭美增值服务\" />');
            tmp.push('<h2>' + tmpService.sName + '</h2>');
            tmp.push('<p>' + tmpService.sDetail + '</p>');
            tmp.push('</li>');
        };
        tmp.push('</ul>');
        return tmp.join("");
    }

    var imglazyLoading = function() {
        var lazyImg = $("img.lazy");
        if (lazyImg.length) {
            lazyImg.removeClass("lazy").lazyload({
                effect: "fadeIn"
            });
        }
    }

    /**
     * 付款成功页面底部按钮点击监听
     * */
    var addFootBtnclickListener = function () {
        $("#getAllTicketBtn").on("click", function () {
            window.location = "../user/myTicket.html";
        });
        $('#refreshBtn').on('click', function () {
            //window.location.reload();
        });
        $("#continueShopBtn").on("click", function () {
            window.location = "../salon/salonList.html";
        });
    };
    return {
        'init': init
    }
});


