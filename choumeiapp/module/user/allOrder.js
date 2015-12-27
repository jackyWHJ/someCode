/**
* @Author: zhanghuizhi
* @Date:2015-12-08 
*/
define(["jquery", "commonUtils"],
    function($, utils) {
        var userId='',
            user={},
            ticketNo='',
            pageNum=1,
            pageSize=20,
            orderType ='',
            cache={},
            item={},
            $orderTitle =$('#orderTitle');
        var init = function(){
            user =  utils.checkLogin();
            if(user){
                userId = user.userId;
            }
            utils.addBack();
            utils.addMenu();
            orderType = utils.getQueryString("orderType");
            orderList.getOrderData();
            getWxConfigData();
            //utils.goTop();  
        }
        var orderList = {
            getOrderData:function(){
                utils.request({data:{
                    userId:userId,
                    pageNum:pageNum,
                    pageSize:pageSize
                },successCallback:orderList.getCallBack,url:apiConfig.newApi+"user/all-order-list.html"});
            },
            getCallBack:function(data){
                if(data.code==0){
                    var mainData = data.response.items,
                        mainDataLen = mainData.length,
                        objListArr=[];
                    if(mainDataLen==0&&pageNum==1){
                        $('#noContentTips').show();
                    }
                    $.each(mainData,function(index,item){
                        var itemType = item.type,
                            orderSn = item.orderSn,
                            itemId = item.itemId,
                            salonId = item.salonId,
                            orderTicketId=item.orderTicketId,
                            articleCodeId = item.articleCodeId,
                            ticketNo = item.ticketNo,
                            canLaisee = item.canLaisee,
                            isValidLaisee = item.isValidLaisee,
                            orderStatus =item.status,
                            orderStatusText='',
                            isGift = item.isGift,
                            type = item.type,
                            str='',
                            rangeKey =Math.random(),
                            dataKey = rangeKey++;
                        switch(orderStatus){
                            case 1:
                                orderStatusText='未消费';
                            break;
                            case 2:
                                orderStatusText ='未评价';
                            break;
                            case 3:
                                orderStatusText='已评价';
                            break;
                            case 4:
                                orderStatusText='已完成';
                            break;
                            case 5:
                                orderStatusText='退款中';
                            break;
                            case 6:
                                orderStatusText='已退款';
                            break;
                            case 7:
                                orderStatusText='已过期';
                            break;
                            case 8:
                                orderStatusText='已退款';
                            break;
                            default:
                            break;
                        }
                        objListArr.push('<div class="order-list">');
                        objListArr.push('<p class="ol-header"><span class="text-overflow">'+item.salonName+'</span>');
                        if(orderStatus=='1'||orderStatus=='2'||orderStatus=='5'){
                            objListArr.push('<em class="main-color">'+orderStatusText+'</em></p>');
                        }
                        else{
                            objListArr.push('<em>'+orderStatusText+'</em></p>');
                        } 
                        if(type=='MF'){
                            objListArr.push('<div class="ol-info" itemId='+itemId+'>');  
                        }
                        else{
                            if(articleCodeId){
                                objListArr.push('<div class="ol-info"  articleCodeId='+articleCodeId+'>');  
                            }else{
                                objListArr.push('<div class="ol-info"  orderSn='+orderSn+'>');  
                            }
                        } 
                        objListArr.push('<img onerror="this.src=\'../../images/default_img.png\'" src="'+item.imgUrl+'" class="oli-img"/>');
                        objListArr.push('<div class="oli-right">');
                        if(articleCodeId){
                            if(isGift=='Y'){
                                objListArr.push('<div class="olir-top"><p class="olir-text1 text-overflow">'+item.itemName+'</p><i class="gift-tips">赠送</i></div>');
                            }
                        }
                        else{
                            objListArr.push('<p class="olir-text1 text-overflow">'+item.itemName+'</p>');
                        }

                        var str = (type=='MF')?'':'预约金';
                        if(type='MF'){
                            str='臭美价';
                        }
                        else{
                            str='预约金';
                            if(articleCodeId){
                                if(isGift=='Y'){
                                    str='会员疗程价';
                                }
                            }
                        }
                        objListArr.push('<p class="olir-text2">'+str+'<span class="main-color">￥'+item.money+'</span></p>');
                        objListArr.push('<p class="olir-text3">购买时间：'+item.payTime+'</p></div></div>');
                        objListArr.push('<p class="ol-bottom">');                     
                        if(itemType =='MF'){  
                            //美发
                            if(orderStatus!='5'&&orderStatus!='6'){
                                objListArr.push('<span class="olb-btn view-cmticket" ticketNo='+ticketNo+'>查看臭美券</span>');
                            }
                            if(orderStatus=='2'){
                                objListArr.push('<span class="olb-btn evaluate-btn" itemId='+itemId+' salonId='+salonId+' orderTicketId='+orderTicketId+'>评价</span>');
                            }
                            else if(orderStatus=='3'){
                                objListArr.push('<span class="olb-btn view-evalutate" itemId='+itemId+' salonId='+salonId+' orderTicketId='+orderTicketId+'>查看评价</span>');
                                if(canLaisee=='Y'){
                                    if(isValidLaisee=='Y'){
                                        objListArr.push('<span class="olb-btn view-redpacket" orderTicketId='+orderTicketId+'>查看红包</span>');
                                    }
                                    else{
                                        objListArr.push('<span class="olb-btn view-redpacket" orderTicketId='+orderTicketId+'>分享</span>');
                                    }
                                }
                            }
                        }else{ 
                            //非美发
                            if(orderStatus=='4'||orderStatus=='1'){
                                if(articleCodeId){
                                    //赠送单
                                    objListArr.push('<span class="olb-btn view-booking-btn"  articleCodeId='+articleCodeId+'>查看预约单</span>');
                                }
                                else{
                                    //非赠送单
                                    objListArr.push('<span class="olb-btn view-booking-btn" orderSn='+orderSn+'>查看预约单</span>');
                                }
                            }
                        }
                        if(orderStatus=='5'||orderStatus=='6'){
                            if(ticketNo){
                                objListArr.push('<span class="olb-btn view-refunds" ticketNo='+ticketNo+' dataKey='+dataKey+'>退款详情</span>');
                            }else{
                                objListArr.push('<span class="olb-btn view-refunds" orderSn='+orderSn+' dataKey='+dataKey+'>退款详情</span>');
                            }
                            cache[dataKey] = item;
                        }
                        else if(orderStatus=='8'){
                            objListArr.push('<span class="olb-btn view-refunds" orderSn='+orderSn+' dataKey='+dataKey+' status='+orderStatus+'>退款详情</span>');
                            cache[dataKey] = item;
                        }

                        if(articleCodeId){
                            if(isGift=='Y'){
                                objListArr.push('<span class="ol-valid">有效期 '+item.giftStartTime+'至 '+item.giftEndTime+'</span>');
                            }
                        }
                        objListArr.push('</p></div></div>');
                    });
                    $('#orderBox').append($(objListArr.join('')));
                   
                    if(mainDataLen >= pageSize && pageNum ==1){
                        $(document).bind("scroll",orderList.addPageScrollListener);
                    }
                    pageNum++;
                    orderList.addOrderListener();
                }
            },
            addOrderListener:function(){
                $('.ol-info').off('click').on('click',function(){
                    item= cache[$(this).attr('dataKey')];
                    window.sessionStorage.setItem("item",JSON.stringify(item));
                    window.localStorage.setItem("item",JSON.stringify(item));
                    var itemId = $(this).attr('itemId'),
                        orderSn =$(this).attr('orderSn'),
                        articleCodeId =$(this).attr('articleCodeId');
                    if(itemId){
                        window.location ="../home/itemDetail.html?itemId="+itemId;
                    }else {
                        //跳转到预约单详情页
                        if(articleCodeId){
                            window.location ='../appoint/appoint-detail.html?articleCodeId='+articleCodeId; 
                        }else{
                            window.location ='../appoint/appoint-detail.html?beautySn='+orderSn;
                        }  
                    }
                });
                //查看臭美券
                $('.view-cmticket').off('click').on('click',function(){
                    var ticketNo =$(this).attr('ticketNo');
                    window.location = 'ticketDetail.html?ticketNo='+ticketNo;
                });
                //查看预约单
                $('.view-booking-btn').off('click').on('click',function(){
                    var orderSn = $(this).attr('orderSn'),
                        articleCodeId = $(this).attr('articleCodeId');
                    if(articleCodeId){
                        //赠送
                        window.location ='../appoint/appoint-detail.html?articleCodeId='+articleCodeId;
                    }
                    else{
                        window.location ='../appoint/appoint-detail.html?beautySn='+orderSn;
                    }
                });
                //评价
                $('.evaluate-btn').off('click').on('click',function(){
                    var salonId =$(this).attr('salonId'),
                        itemId =$(this).attr('itemId'),
                        orderTicketId =$(this).attr('orderTicketId'),
                        itemName =$(this).parent().siblings('.ol-info').find('.olir-text1').text();
                    window.location='evaluateConsume.html?salonId='+salonId+'&itemId='+itemId+'&orderTicketId='+orderTicketId+'&itemName='+encodeURI(itemName);
                });
                //查看评价
                $('.view-evalutate').off('click').on('click',function(){
                    var salonId =$(this).attr('salonId'),
                        itemId =$(this).attr('itemId'),
                        orderTicketId =$(this).attr('orderTicketId');
                    window.location ="evaluateDetail.html?orderTicketId="+orderTicketId+"&salonId="+salonId+"&itemId="+itemId;
                });
                
                //退款详情
                $('.view-refunds').off('click').on("click",function(){
                    item= cache[$(this).attr('dataKey')];
                    window.sessionStorage.setItem("item",JSON.stringify(item));
                    window.localStorage.setItem("item",JSON.stringify(item));
                    console.log(window.sessionStorage.getItem("item"));
                    var ticketNo = $(this).attr('ticketNo'),
                        bookingSn = $(this).attr('bookingSn'),
                        orderSn =$(this).attr('orderSn'),
                        status = $(this).attr('status');
                    if(ticketNo){
                        window.location = "refundsDetail.html?ticketNo=" + ticketNo;
                    }
                    else{
                        if(status='8'){
                            window.location ='../appoint/appoint-detail.html?beautySn='+orderSn;
                        }else{
                            window.location = "refundsDetail.html?orderSn=" + orderSn;
                        }
                    }
                });
                //查看红包
                $('.view-redpacket').off("click").on('click',function(){
                    var orderTicketId = $(this).attr('orderTicketId');
                    utils.request({
                        data:{orderTicketId:orderTicketId},
                        successCallback:function(data){
                            if(data.code == 0){
                                wxShare.initData(data.response);
                                $("#coverShare").show().off("click").on("click",function(){
                                    $(this).hide();
                                });
                            }
                            else{
                                utils.showTip(data.message);
                            }
                        },
                        url:apiConfig.newApi+"laisee/creat-laisee.html"
                    });
                });
            },
            addPageScrollListener:function(){
                var nScrollHight = $(document).height();
                var nScrollTop = $(document).scrollTop();
                var nDivHight = $(window).height();
                if(nScrollTop + nDivHight >= nScrollHight){
                    orderList.getOrderData();
                }
            }
        }
        var wxShare = {
            shareTimelineData:{
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                link: window.location.href.split("#")[0],
                imgUrl: "http://" + window.location.host + "/module/sf/img/share.png",
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    //commonUtils.alert('已分享到朋友圈');
                },
                cancel: function (res) {
                    //commonUtils.alert('已取消分享到朋友圈');
                },
                fail: function (res) {
                    //commonUtils.alert('分享到朋友圈失败！');
                }
            },
            shareAppMessageData:{
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                desc: '良辰最喜欢对那些跟我关系好的人出手了，拯救你们的发型，就用臭美App！', // 分享描述
                link: window.location.href.split("#")[0],
                imgUrl:  "http://" + window.location.host + "/module/sf/img/share.png",
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                trigger: function (res) {
                    //alert('用户点击分享到朋友');
                },
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //commonUtils.alert('已分享到朋友');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    //commonUtils.alert('已取消分享到朋友');
                },
                fail: function () {
                    //commonUtils.alert('分享到朋友失败！');
                }
            },
            initData:function(data){
                wxShare.shareAppMessageData.title = wxShare.shareTimelineData.title = data.wechatTitle;
                wxShare.shareAppMessageData.link = wxShare.shareTimelineData.link = data.h5URL;
                wxShare.shareAppMessageData.imgUrl = wxShare.shareTimelineData.imgUrl = data.imgURL;
                wxShare.shareTimelineData.desc = data.wechatContent;
            },
            wxCallback: function( config ){
                if( wx ){
                    wx.config({
                        debug: false,
                        appId: config.appId,
                        timestamp: config.timestamp,
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature,// 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function(){
                        wx.checkJsApi({
                            jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
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
                                    wx.onMenuShareTimeline(wxShare.shareTimelineData);
                                }
                                else{
                                    utils.alert("分享到朋友圈功能不可用！");
                                }
                                if( result.checkResult.onMenuShareAppMessage ){
                                    // 2.3 监听“分享到朋友”按钮点击、自定义分享内容及分享结果接口
                                    wx.onMenuShareAppMessage(wxShare.shareAppMessageData);
                                } else{
                                    utils.alert("分享给朋友功能不可用！");
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
            }
        };

        var getWxConfigData = function(){
            var data = {
                to: 'signPackage',
                type: 'Wechat',
                body: {
                    url:  window.location.href.split("#")[0]
                }
            }
            utils.ajaxRequest({
                data:data,
                successCallback:function (data) {
                    if (data.result != 1) {
                        utils.alert(data.msg);
                    } else {
                        var config = data.data.main ;
                        wxShare.wxCallback( config );
                    }
                },
                url:apiConfig.userApi
            });
        };
        return {
            'init':init
        }
    }
   )
