/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-12-07 19:52:34
 * @version $Id$
 */
define(['jquery', 'commonUtils'], function($, commonUtils) {
    var orderSn = null,
        salonId = null,
        itemType = null;
    var init = function() {
        orderSn = commonUtils.getQueryString('beautySn');
        getResultData();
    }
    var getResultData = function() {
        commonUtils.request({
            data: {
                orderSn: orderSn
            },
            url: apiConfig.newApi + "booking/ticket.html",
            successCallback: renderResultPage
        })
    }
    var renderResultPage = function(data) {
        console.dir(data);
        if (data.code != 0) {
            commonUtils.alert(data.message);
        } else {
            data = data.response;
            if (!data.bookingSn) {//延迟的情况，无法获取bookingSn
                $('#itemName').text(data.bookingItemNames);
                $('#title').text('预约成功');
                $('#viewTicket,#invitation,#delayTip,.appoint-row').toggle();
                $('#refresh').show().on('click',function(){
                    location.reload();
                });
            }else{
                $('#itemName').text(data.bookingItemNames);
                $('#bookingSn').text(data.bookingSn);
                $('#bookingDate').text(data.bookingDate);
                $('#amount').text('￥'+data.payableAmount);
                salonId = data.beautyId, itemType = data.itemType;
                initViewTicket();
                if(data.inviteUrl){
                    $('#invitation').show().on('click', function() {
                        location = data.inviteUrl;
                    })
                }
                //支付成功了，移除此订单停牌
                //sessionStorage.removeItem("appoint-bill");
                //添加订单信息
                sessionStorage.setItem("appoint-ticket",JSON.stringify(data));
            }
            
        }
    }
    var initViewTicket = function() {
        $('#viewTicket').on('click', function() {
            location = 'appoint-detail.html';
        })
    }
    return {
        init: init
    }
})