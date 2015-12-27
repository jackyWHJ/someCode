define(["jquery", "commonUtils"],
    function($, utils) {
        var user = {},
            userId = '',
            page=1,
            pageSize=20,salonId='',
            itemId='',
            orderTicketId='',
            nScrollHight = 0,
            nScrollTop=0,
            nDivHight=0;
        var init = function(){
            user =  utils.checkLogin();
            if(user){
                userId = user.userId;
            }
            myEvaluateList.getEvaluateListData();
            utils.goTop();
            var activityTime = utils.getQueryString("activityTime");
            if(activityTime){
                $("#ertTimes").html(activityTime);
                $("#evaluate-redpacket-tips").show();
            }
            
            getWxConfigData();
        };
        var myEvaluateList ={
            getEvaluateListData:function(){
                var data = {
                    userId:userId,
                    page:page,
                    pageSize:pageSize
                };
                utils.request({data:data,successCallback:this.getEvaluateListCallback,url:apiConfig.newApi+"order/history.html"});
            },
            getEvaluateListCallback :function(data){
                utils.hideLoading();
                if(data.code==0){
                    var evaluateListData = data.response,
                        evaluateListDataLen = evaluateListData.length,
                        evaluateListArr=[];
                    if(evaluateListDataLen==0&&page==1){
                        $('#noEvaluateTips').show();
                    }
                    for(var i=0;i<evaluateListDataLen;i++){
                        var seblStatusText ='';
                        var isCommented = evaluateListData[i].isCommented,
                            satisfyType = evaluateListData[i].satisfyType,
                            itemFormat =evaluateListData[i].itemFormat;
                        evaluateListArr.push('<div class="seb-list" orderTicketId='+evaluateListData[i].orderTicketId+'>');
                        evaluateListArr.push('<h2 class="sebl-title salon-title" salonId='+evaluateListData[i].salonId+'>'+evaluateListData[i].salonName+'</h2>');
                        evaluateListArr.push('<div class="sebl-title item-title"  itemId='+evaluateListData[i].itemId+'><h2>'+evaluateListData[i].itemName+'</h2>');
                        if(itemFormat!=''){
                            evaluateListArr.push('<p>'+itemFormat+'</p>');
                        }
                        else{
                            evaluateListArr.push('<p>无规格</p>');
                        }
                        evaluateListArr.push('</div>');
                        evaluateListArr.push('<div class="sebl-info clearfix">');
                        evaluateListArr.push('<p>臭美券密码：<span id="seblTicketNo">'+evaluateListData[i].ticketNO.substring(0,4)+' '+evaluateListData[i].ticketNO.substring(4,8)+'</span></p>');
                        evaluateListArr.push('<p class="clearfix"><span class="sebl-usetime">消费时间：<em id="seblUseTime">'+evaluateListData[i].useTime+'</em></span>');
                        evaluateListArr.push('<span class="sebl-pay-amount">消费金额：<em id="seblPayAmount" class="main-color">￥'+evaluateListData[i].amount+'</em></span></p></div>');
                        evaluateListArr.push('<p class="sebl-status clearfix">');
                        if(!isCommented){
                            seblStatusText ='待点评';
                            evaluateListArr.push('<em class="main-color" id="seblStatus">'+seblStatusText+'</em>');
                            evaluateListArr.push('<a href="javascript:void(0)" class="evaluate-btn unvaluate">评价</a>');
                        }else{
                            evaluateListArr.push('<em  id="seblStatus">'+satisfyType+'</em>');
                            evaluateListArr.push('<a href="javascript:void(0)"  class="evaluate-btn view-evaluate">查看评价</a>');
                            //send redpacket
                            if(evaluateListData[i].canLaisee=="Y"){
                                if(evaluateListData[i].isValidLaisee=='Y'){
                                    evaluateListArr.push('<a href="javascript:void(0)" class="evaluate-btn send-redpacket">查看红包</a>');
                                }
                                else{
                                    evaluateListArr.push('<a href="javascript:void(0)" class="evaluate-btn send-redpacket">分享</a>');
                                }
                            }
                        }
                        evaluateListArr.push('</p></div>');
                    }
                    $('#evaluateListBox').append($(evaluateListArr.join('')));
                    myEvaluateList.addEvaluateListener();
                    if(evaluateListDataLen > pageSize && page ==1){
                        $(document).bind("scroll",myEvaluateList.addPageScrollListener);
                    }
                    page ++;
                }
                else{
                    utils.showTip(data.message);
                }
            },
            addEvaluateListener :function(){
                $('.salon-title').off("click").on('click',function(){
                    var salonId = $(this).attr('salonId');
                    window.location="../salon/salonIndex.html?salonId="+salonId;
                });
                $('.item-title').off("click").on('click',function(){
                    var ticketNo =$(this).siblings('.sebl-info').find('#seblTicketNo').text().replace(/[ ]/g,"");
                    window.location="ticketDetail.html?ticketNo="+ticketNo;
                });
                $('.unvaluate').off("click").on('click',function(){
                    salonId = $(this).parent('.sebl-status').siblings('.sebl-title').eq(0).attr('salonId'),
                    itemId = $(this).parent('.sebl-status').siblings('.sebl-title').eq(1).attr('itemId'),
                    orderTicketId = $(this).parents('.seb-list').attr('orderTicketId');
                    var evaluateItemNameText =$(this).parent('.sebl-status').siblings('.sebl-title').eq(0).text();
                    window.location ="evaluateConsume.html?orderTicketId="+orderTicketId+"&salonId="+salonId+"&itemId="+itemId+"&evaluateItemName="+encodeURI(evaluateItemNameText);
                });
                $('.view-evaluate').off("click").on('click',function(){
                    salonId = $(this).parent('.sebl-status').siblings('.sebl-title').eq(0).attr('salonId'),
                    itemId = $(this).parent('.sebl-status').siblings('.sebl-title').eq(1).attr('itemId'),
                    orderTicketId = $(this).parents('.seb-list').attr('orderTicketId');
                    window.location ="evaluateDetail.html?orderTicketId="+orderTicketId+"&salonId="+salonId+"&itemId="+itemId;
                });
                $('.send-redpacket').off("click").on('click',function(){
                    orderTicketId = $(this).parents('.seb-list').attr('orderTicketId');
                    var data = {
                        orderTicketId:orderTicketId
                    };
                    utils.request({
                        data:data,
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
                nScrollHight = $(document).height();
                nScrollTop = $(document).scrollTop();
                nDivHight = $(window).height();
                if(nScrollTop + nDivHight >= nScrollHight){
                    myEvaluateList.getEvaluateListData();
                }
            }
        };
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
        return{
            'init':init
        };
    }
)
