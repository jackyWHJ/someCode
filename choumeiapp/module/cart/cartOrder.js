define(["jquery", "commonUtils", 'utils/module/tongdun'], function($,commonUtils,td) {
    var user = {}, userId = "",
        payWay = 0,  // 1---支付宝支付;  2-----微信支付; 3---易联支付；0-----余额支付；-1 未确定支付方式 -1去掉，出bug
        shopcartSn = "",
        payMoney = 0,
        num = 0,
        orderSn = '',
        sallData = '',
        allData = '',
        pageSize = 20,
        pageNumber = 1,
        vCancelStatus = 1,
        vIded = null, //点 取消 选择 现金券
        vId = null, //现金券id
        balance = 0,//余额
        salonId = null,//店铺id
        itemId = null,//项目id
        normsId = null,//规格
        hasVocher = false;//是否有现金券
    var init = function (id) {
        user = JSON.parse(window.sessionStorage.getItem("user") || window.localStorage.getItem("user"));
        if (user) {
            userId = user.userId;
        }
        orderSn = commonUtils.getQueryString("orderSn");
        shopcartSn = commonUtils.getQueryString("shopcartSn");
        /*if(window.sessionStorage.getItem("buySuccess")){
         window.sessionStorage.removeItem("buySuccess");
         window.history.go(-2);
         }
         else{
         //            sessionStorage.setItem('cartOrderEnterMark',true);//标记已经进入确认支付页面

         }*/
        getConfirmCartOrderData();
    };

    /**
     * 获取确认订单信息
     * toRequest 需要重新请求数据，而不是读取本地数据
     * */
    var getConfirmCartOrderData = function (toRequest) {
        if (shopcartSn) {
            var data = JSON.parse(sessionStorage.getItem("bill-cart"))||{};
            if(toRequest){
                commonUtils.request({
                    data:{
                        userId:userId,
                        shopcartSn:shopcartSn,
                        voucherId:vId
                    },
                    url:apiConfig.newApi+"cart/place.html",
                    successCallback:function(data){
                        if(data.code == 0){
                            sallData = data = data.response;
                            renderContent(data);
                        }else{
                            commonUtils.alert(data.message);
                        }
                    }
                })
            }else{
                if(data.shopcartSn){
                    sallData = data;
                    if(data.voucher){
                        hasVocher = true;
                    }
                    renderContent(data);
                }else{
                    commonUtils.alert("订单无效，请重新下单");
                }
            }
            
        }
        else if (orderSn) {

            var data = JSON.parse(sessionStorage.getItem("bill-buynow"))||{};
            if(toRequest){
                commonUtils.request({
                    data:{
                        userId:userId,
                        itemId:itemId,
                        normsId:normsId,
                        orderSn:orderSn,
                        voucherId:vId
                    },
                    url:apiConfig.newApi+"order/place.html",
                    successCallback:function(data){
                        if(data.code == 0){
                            sallData = data = data.response;
                            renderContent(data);
                        }else{
                            commonUtils.alert(data.message);
                        }
                    }
                })
            }else{
                if(data.orderSn){
                    sallData = data;
                    if(data.voucher){
                        hasVocher = true;
                    }
                    renderContent(data);
                }else{
                    commonUtils.alert("订单无效，请重新下单");
                }
            }
        }
        else {
            commonUtils.alert("参数错误，请返回重试！");
        }
        
    };

    /**
     * 渲染详情
     * */
    var renderContent = function (data) {
        allData = data;
        console.dir(data);
        if (shopcartSn) {
            
            renderSubmitCartOrder(data);
        }
        else if (orderSn) {
            renderSubmitOrder(data);
        }
    };

    /**
     * 渲染现金券选择页面
     * */
    var renderVocherChoose = function () {

        /***********点击跳转到现金券选择*************/
        $("#vocher-choose").on( "click", function (e) {

            $("#cartOrder").hide();
            $("#choose-voucher").show();

            getVoucherData();

            vIded = vId;

        });

        var getVoucherData = function () {

            var data = {}, totalNum = 0;
            if (shopcartSn) {
                data = {to: "chooseVoucher", type: "Voucher", body: {"userId": userId, "shopcartSn": shopcartSn,"page":pageNumber,"pageSize":pageSize}};
            }
            else if (orderSn) {
                data = {to: "chooseVoucher", type: "Voucher", body: {"userId": userId, "orderSn": orderSn,"page":pageNumber,"pageSize":pageSize}};
            }

            commonUtils.ajaxRequest({
                url: apiConfig.orderApi,
                data: data,
                successCallback: function (data) {

                    var html = '';

                    if (data.result == 1) {

                        if(!data.data.main) return;
                        $.each(data.data.main, function (index, value) {

                            if (vId == value.vId) {
                                html += '<li data-id="' + value.vId +
                                    '" data-clicked="true" class="click"><div class="roll row"><div class="row-title normal"></div><div class="row-logo normal"></div>' +
                                    '<div class="column small-4"><span>&yen;</span><b class="money">' + value.vUseMoney +
                                    '</b></div><div class="column small-8"><div class="title">' + value.vcTitle +
                                    '</div><div class="content">' + value.limit +
                                    '</div><div class="time">' + value.vUseStart + '至' + value.vUseEnd +
                                    '</div></div><div class="line"></div><div class="clicked"><div class="clicked-bg"></div><div class="clicked-line"></div></div></div></li>';
                            } else {
                                html += '<li data-id="' + value.vId +
                                    '" data-clicked="false" ><div class="roll row"><div class="row-title normal"></div><div class="row-logo normal"></div>' +
                                    '<div class="column small-4"><span>&yen;</span><b class="money">' + value.vUseMoney +
                                    '</b></div><div class="column small-8"><div class="title">' + value.vcTitle +
                                    '</div><div class="content">' + value.limit +
                                    '</div><div class="time">' + value.vUseStart + '至' + value.vUseEnd +
                                    '</div></div><div class="line"></div></div></li>';
                            }


                        });
                        if(pageNumber == 1){
                            $("#choose-voucher .voucher-con ul").html(html);
                        }
                        else{
                            $("#choose-voucher .voucher-con ul").append(html);
                        }

                        if (data.data.other.totalNum >= pageSize && pageNumber == 1) {
                            $(document).off().bind("scroll", pageScrollListener);
                        }
                        pageNumber++;
                    } else {
                        commonUtils.alert(data.msg);
                    }
                }
            });

        }

        var pageScrollListener = function (e) {
            var nScrollHight = $(document).height(),
                nScrollTop = $(document).scrollTop(),
                nDivHight = $(window).height();

            if (nScrollTop + nDivHight >= nScrollHight) {
                getVoucherData();
            }
        }

        /***********取消现金券选择*************/
        $("#choose-voucher-cancel").unbind("click").on("click", function (e) {
            $("#cartOrder").show();
            $("#choose-voucher").hide();
            vId = vIded;

            //console.log( "vId : " + vId );
        });
        /***********确定现金券选择*************/
        $("#choose-voucher-ok").unbind("click").on("click", function (e) {

            if ($("#choose-voucher li.click").length > 0) {
                //得到 id  值
                vId = parseInt($("#choose-voucher").find(".click").attr("data-id"));
                vCancelStatus = 1;
            } else {
                vId = null;
                vCancelStatus = 0;
            }

            getConfirmCartOrderData(true);//重新加载数据
            $("#choose-voucher").hide();
            $("#cartOrder").show();
        });

        /***********现金券选取*************/
        $("#choose-voucher").unbind("click").on("click", ".voucher-con li", {status: true}, function (e) {


            if ($(this).attr("data-clicked") == 'false') {
                $(".voucher-con li").attr("data-clicked", "false").removeClass("click").find(".clicked").remove();
                $(this).addClass("click").attr("data-clicked", "true").find(".row").append('<div class="clicked"><div class="clicked-bg"></div><div class="clicked-line"></div></div>');
                vId = $(this).attr('data-id');
            } else {
                $(this).removeClass("click").attr("data-clicked", "false").find(".clicked").remove();
                //vId = null;
            }

            //获取Vid
            //console.log( "vId : " + vId );

            return false;
        });
    }

    /**
     * 渲染确认订单信息页面
     * */
    var renderSubmitCartOrder = function (data) {
        var listLen = data.salons.length, itemLen = 0, orderListArr = [];
        $('#cartOrderList').html('');
        for (var i = 0; i < listLen; i++) {
            itemLen = data.salons[i].items.length;
            var dataList = data.salons[i];
            orderListArr.push('<div class="order-item-box">');
            orderListArr.push('<h2 class="oib-title">' + dataList.salonName + '</h2>');
            for (var j = 0; j < itemLen; j++) {
                var itemList = dataList.items[j];
                orderListArr.push('<div class="oib-list"><div class="oib-area"><div class="clearfix"><div class="order-item-name">' + itemList.itemName + '</div>');
                orderListArr.push('<span class="order-item-price oi-price">￥' + itemList.discountPrice + '</span></div>');
                                orderListArr.push('<div class="oip-rule"><span class="oipr-text">' + (itemList.normsDescription || "无规格") + '</span>');
                orderListArr.push('<em class="oip-num">X' + itemList.quantity + '</em></div></div></div>');
                orderListArr.push('<div class="cart-item-condition">');
                if (itemList.buyLimits && itemList.buyLimits.length > 0) {
                    orderListArr.push('<ul class="clearfix">');
                    for (var k = 0, ruleLen = itemList.buyLimits.length; k < ruleLen; k++) {
                        orderListArr.push('<li>' + itemList.buyLimits[k] + '</li>');
                    }
                    orderListArr.push('</ul>');
                }
                var useLimit = itemList.useLimit;
                if (useLimit) {
                    orderListArr.push('<p class="cart-item-tips">' + useLimit + '</p>');
                }
                orderListArr.push('</div>');
            }
            orderListArr.push('<div class="order-sum"><span>共<em>' + dataList.totalQuantity + '</em>个项目</span>');
            orderListArr.push('<span>小计：<em class="oi-price">￥' + dataList.totalAmount + '</em></span></div></div>');

        }

        // 现金券选择
        if (hasVocher) {
            if( data.voucher ){
                vId = data.voucher.vId;
                $(".vocher-pay-content").html(
                    //"<span>现金券:</span><b style='font-weight: normal;float: right'>选择现金券 <span style='" +
                    //"display: inline-block; background:url(../../images/user/next_pressed@2x.png) no-repeat left top;width: 20px; height: 15px;" +
                    //"-webkit-background-size: contain;background-size: contain;vertical-align: middle;margin-left: 8px;  position: relative;top: -1px;'>" +
                    //"</span></b>"
                    '<div class="vocher-top"><span>现金券:</span><span class="vocher-title vocher-choose-click">' + data.voucher.name +
                    '<span style="display: inline-block; background:url(../../images/user/next_pressed@2x.png) no-repeat left top;width: 20px; height: 15px;' +
                    '-webkit-background-size: contain;background-size: contain;vertical-align: middle;margin-left: 8px;  position: relative;top: -1px;">' +
                    '</span></span></div><div class="vocher-bottom"><span class="vocher-list-type">项目: <span class="vocher-list-title">' + data.voucher.appliedItemName +
                    '</span></span><span class="vocher-list-con">立减 <div id="vocher-pay-num"> ￥' + data.voucher.usableAmount +
                    '</div></span></div>'
                );
            }else{
                $(".vocher-pay-content").html(
                    "<div><span>现金券:</span><b style='font-weight: normal;float: right'>选择现金券 <span style='" +
                    "display: inline-block; background:url(../../images/user/next_pressed@2x.png) no-repeat left top;width: 20px; height: 15px;" +
                    "-webkit-background-size: contain;background-size: contain;vertical-align: middle;margin-left: 8px;  position: relative;top: -1px;'>" +
                    "</span></b></div>"
                );

            }

            renderVocherChoose();

        } else {
            $(".vocher-pay-content").html("<span>现金券:</span><b style='font-weight: normal;float: right'>无可用现金券</b>");
        }

        $(orderListArr.join('')).appendTo($('#cartOrderList'));
        $('#needPay').text('￥' + data.payableAmount);
        $('#remainPayAmount').text('￥' + data.thirdpayAmount);
        //臭美余额
        $("#choumeiBalance").html('￥' + data.userBalance);
        balance = data.userBalance;
        //是否足够支付
        if (data.thirdpayAmount >0) {
            if(commonUtils.isOpenInWechat()){
                $('#otherPay .pay-item:eq(0)').hide();
                payWay = 2;
                
            }else{
                $('#otherPay .pay-item:eq(1)').hide();
                payWay = 1;
            }
            $("#otherPayWay").show();
            $("#otherPay").show();
            addPayWayListener();
        }
        else{
            $("#otherPayWay").hide();
            $("#otherPay").hide();
            payWay = 0;
        }
        payMoney = data.thirdpayAmount;
        addSubmitPayBtnListener();
    };
    /**
     * 渲染确认订单信息页面
     * */
    var renderSubmitOrder = function (data) {
        var  orderListArr = [], normsStr = "";
        normsId = data.normsId;
        orderSn = data.orderSn;
        itemId = data.itemId;
        $('#cartOrderList').html('');
        orderListArr.push('<div class="order-item-box">');
        orderListArr.push('<h2 class="oib-title">' + data.salonName + '</h2>');
        orderListArr.push('<div class="oib-list"><div class="oib-area"><div class="clearfix"><div class="order-item-name">' + data.itemName + '</div>');
        orderListArr.push('<span class="order-item-price oi-price">￥' + data.totalAmount + '</span></div>');
        normsStr = data.normsDescription || "无规格";
        orderListArr.push('<div class="oip-rule"><span class="oipr-text">' + normsStr + '</span>');
        orderListArr.push('<em class="oip-num">X' + data.quantity + '</em></div></div></div>');
        orderListArr.push('<div class="cart-item-condition">');
        if (data.buyLimits && data.buyLimits.length > 0) {
            orderListArr.push('<ul class="clearfix">');
            for (var k = 0, ruleLen = data.buyLimits.length; k < ruleLen; k++) {
                orderListArr.push('<li>' + data.buyLimits[k] + '</li>');
            }
            orderListArr.push('</ul>');
        }
        var useLimit = data.useLimit;
        if (useLimit) {
            orderListArr.push('<p class="cart-item-tips">' + useLimit + '</p>');
        }
        orderListArr.push('</div>');
        orderListArr.push('<div class="order-sum"><span>共<em>' + data.quantity + '</em>个项目</span>');
        orderListArr.push('<span>小计：<em class="oi-price">￥' + data.totalAmount + '</em></span></div></div>');
        $(orderListArr.join('')).appendTo($('#cartOrderList'));

        $('#needPay').text('￥' + data.payableAmount );
        $('#remainPayAmount').text('￥' + data.thirdpayAmount);
        //臭美余额
        $("#choumeiBalance").html('￥' + data.userBalance);
        balance = data.balance;
        //是否足够支付
        if (data.thirdpayAmount > 0) {
            if(commonUtils.isOpenInWechat()){
                $('#otherPay .pay-item:eq(0)').hide();
                payWay = 2;
                
            }else{
                $('#otherPay .pay-item:eq(1)').hide();
                payWay = 1;
            }
            $("#otherPayWay").show();
            $("#otherPay").show();
            addPayWayListener();
        }else{
            $("#otherPayWay").hide();
            $("#otherPay").hide();
            payWay = 0;
        }
        payMoney = data.thirdpayAmount;
        addSubmitPayBtnListener();
        
        // 现金券选择
        if (hasVocher) {
            if( data.voucher ){
                vId = data.voucher.vId;
                $(".vocher-pay-content").html(
                    '<div class="vocher-top"><span>现金券:</span><span class="vocher-title vocher-choose-click">' +data.voucher.name +
                    '<span style="display: inline-block; background:url(../../images/user/next_pressed@2x.png) no-repeat left top;width: 20px; height: 15px;' +
                    '-webkit-background-size: contain;background-size: contain;vertical-align: middle;margin-left: 8px;  position: relative;top: -1px;">' +
                    '</span></span></div><div class="vocher-bottom"><span class="vocher-list-type">项目: <span class="vocher-list-title">' + data.itemName +
                    '</span></span><span class="vocher-list-con">立减 <div id="vocher-pay-num"> ￥' + data.voucher.usableAmount +
                    '</div></span></div>'
                );
            }else{
                $(".vocher-pay-content").html(
                    "<div><span>现金券:</span><b style='font-weight: normal;color:#aaa;float: right'>选择现金券 <span style='" +
                    "display: inline-block; background:url(../../images/user/next_pressed@2x.png) no-repeat left top;width: 20px; height: 15px;" +
                    "-webkit-background-size: contain;background-size: contain;vertical-align: middle;margin-left: 8px;  position: relative;top: -1px;'>" +
                    "</span></b></div>"
                );
            }
            renderVocherChoose();
        } else {
            $(".vocher-pay-content").html("<span>现金券:</span><b style='font-weight: normal;float: right'>无可用现金券</b>");
        }
    };

    /**
     * 添加付款方式点击监听
     * */
    var addPayWayListener = function () {
        $("#otherPay > div").on("click", function () {
            payWay = $(this).attr("payWay");
            $("#otherPay > div div.selectBtn").removeClass("select-btn");
            $("#otherPay > div div.selectBtn").addClass("unselect-btn");
            $(this).find("div.selectBtn").removeClass("unselect-btn");
            $(this).find("div.selectBtn").addClass("select-btn");
        });
    };

    /**
     * 添加确认支付点击监听
     * */
    var addSubmitPayBtnListener = function () {
        var payUrl = "";
        if (payWay > 0) {
            $('#header').text('选择支付方式');
        }
        else {
            $('#header').text('余额支付');
        }
        $("#submitPayBtn").off().one("click", function () {
            /*if(sessionStorage.getItem('cartOrderEnterMark')){
             sessionStorage.removeItem('cartOrderEnterMark');
             }*/
            var tongdunPayType = [];
            //tongdun 支付方式，1. 微信支付；2. 支付宝支付；3. 易联支付；4. 余额支付
            if(balance>0){
                tongdunPayType.push(4);
            }
            if(payWay==1){
                tongdunPayType.push(2);
            }else if(payWay==2){
                tongdunPayType.push(1);
            }else if(payWay==3){
                tongdunPayType.push(3);
            }
            tongdunPayType = tongdunPayType.join();
            if(shopcartSn){
                tongdun({url:"trade/shopcart/pay.html",data:{"shopcartSN":shopcartSn,payType:tongdunPayType}});
            }else{
                tongdun({url:"trade/shopcart/pay.html",data:{"orderSN":orderSn,payType:tongdunPayType}});
            }
            if (payWay > 0) {//余额不足时
                //其他3种不同的支付方式跳转
                if (payWay == 1) {//支付定支付
                    alipay();
                }
                else if (payWay == 2) {//微信支付
                   
                    weixinPay();
                }
                else if (payWay == 3) {//易联支付
                    payeco();
                }//end payWay=3

            }
            else {//余额充足时
                //如果有现金券
                payAction();
            }
        });
    };

    /**
     * 余额支付
     * */
    var payAction = function () {
        var data = {};
        if (shopcartSn) {
            data = {to: "moneyPay", type: "Shopcart", body: {"userId": userId, "shopcartsn": shopcartSn,"vId":vId}};
        }
        else if (orderSn) {
            data = {to: "confirmPay", type: "Order", body: {"userId": userId, "orderSn": orderSn,"vId":vId}};
        }
        commonUtils.ajaxRequest({
            data: data, successCallback: function (data) {
                if (data.result) {
                    //支付成功页面
                    if (shopcartSn) {
                        window.location = "paySuccess.html?shopcartSn=" + shopcartSn;
                    }
                    else if (orderSn) {
                        window.location = "paySuccess.html?orderSn=" + orderSn;
                    }
                }
                else {
                    commonUtils.showTip(data.msg);
                    console.log("余额支付失败！" + data.msg);
                }
            }, url: apiConfig.orderApi
        });
    };
    //易联支付
    var payeco = function(){
            commonUtils.request({
            url:apiConfig.newApi+"payeco/placeh5.html",
            data:{
                shopcartsn:""||shopcartSn,
                ordersn:""||orderSn,
                amount:""||payMoney,
                userId:userId
              },
            successCallback:function(data){
                if(data.code == 0){
                    location =  data.response.payUrl;
                }else{
                    commonUtils.alert(data.message);
                }
            }
          })
        };
    //微信支付
    var weixinPay = function(){
        var data = {
            shopcartsn:""||shopcartSn,
            ordersn:""||orderSn,
            amount:""||payMoney,
            userId:userId
          };
        var osStr = window.navigator.userAgent;
        var queryStr = "bundle=FQA5WK2BN43YRM8Z&version=5.3&device-type=WECHAT&device-dpi="+window.screen.width+"x"+window.screen.height
            +"&device-model=&device-network=&device-uuid="+commonUtils.randomString()+"&device-cpu=&device-os="+osStr
            +"&timestamp="+new Date().getTime()+"&sequence="+commonUtils.requestTime+(commonUtils.requestCount++)+"&access-token="+commonUtils.cache.accessToken+"&request="+JSON.stringify(data);
        queryStr += "&sign=" + $.md5(queryStr);
        queryStr = queryStr.replace(/device-os=([^&]*)(&|$)/,"device-os="+encodeURIComponent(osStr)+"&");
        location = apiConfig.newApi+"wechat/placeh5.html"+"?"+queryStr;
    }
    var alipay = function(){
        commonUtils.request({
        url:apiConfig.newApi+"alipay/placeh5.html",
        data:{
            shopcartsn:""||shopcartSn,
            ordersn:""||orderSn,
            amount:""||payMoney,
            userId:userId
          },
        successCallback:function(data){
            console.dir(data)
            if(data.code == 0){
                var form = document.createElement('form'),formElements = [];
                form.action = 'https://mapi.alipay.com/gateway.do?_input_charset=utf8',
                    form.setAttribute('id', 'alipayForm'),form.className = 'hide';
                $.each(data.response.wapPay,function(key,val){
                    formElements.push('<input value ="'+val +'" name="'+key +'">');
                })
                form.innerHTML = formElements.join('');
                document.body.appendChild(form);
                form.submit();
               
            }else{
                commonUtils.alert(data.message);
            }
        }
      })
        
    }
    return {
        'init': init
    }

});