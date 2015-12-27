/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-12-07 20:43:04
 * @version $Id$
 */

define(['jquery','commonUtils'],function($,commonUtils){
    var orderSn,salonId,itemType,articleCodeId,amount,bookingSn;
    var init = function(){
        commonUtils.addBack();
        commonUtils.addMenu();
        articleCodeId = commonUtils.getQueryString('articleCodeId');
        orderSn = commonUtils.getQueryString('beautySn');
        if(orderSn||articleCodeId){
            commonUtils.request({
                data: {
                    orderSn: orderSn,
                    articleCodeId:articleCodeId
                },
                url: apiConfig.newApi + "booking/ticket.html",
                successCallback: function(data){
                    if(data.code != 0){
                        commonUtils.alert(data.message);
                    }else{
                        renderTicketData(data.response);
                    }
                }
            })
        }else{
            var data = JSON.parse(sessionStorage.getItem("appoint-ticket"));
            if(data){
                renderTicketData(data);
            }else{
                commonUtils.alert('暂无订单信息');
            }
            
        }
    }

    var renderTicketData = function(data){
        console.dir(data);
        bookingSn = data.bookingSn;
        if(data.isGift == 'Y'){//赠品
            $('#giftInfo').show();
            $('#payInfo').hide();
            $('#itemName').html('<span class="appoint-gift">赠品</span>'+data.bookingItemNames);
            $('#giftDesc').text(data.present||'暂无描述');
            $('#giftTip').show();
        }else{
            $('#itemName').text(data.bookingItemNames);
        }
        amount = data.payableAmount;
        $('#bookingSn').text(bookingSn);
        $('#bookingDate').text(data.bookingDate);
        
        $('#bookerName').text(data.bookerName);
        $('#amount').text('￥'+amount);
        $('#paiedTime').text(data.paiedTime);
        data.recommendedCode?$('#recommendedCode').text(data.recommendedCode):$('#recommendedCode').parent().hide();
        
        $('#beautyName').text(data.beautyName);
        $('#beautyAddress').text(data.beautyAddress).closest('.appoint-section').on('click',function(){
            location = data.h5Url;
        });
        orderSn = data.orderSn,salonId = data.beautyId,itemType = data.itemType;
        var $status = $('#status'),$statusInfo = $('#statusInfo');
        switch(data.status){

            case 'NEW ':
                $status.text('未支付');
                break;
            case 'PYD':
                $status.text('未消费');
                data.isGift == 'Y'?'':initRefund();
                break;
            case 'CSD':
                $status.text('已完成');
                $statusInfo.append('<div class="appoint-row"><span class="tip">完成时间  </span><span class="val">'+data.completeTime+'</span>').show();
                break;
            case 'RFN':
                $status.text('退款中');
                $statusInfo.append('<div class="appoint-row"><span class="tip">申请退款时间  </span><span class="val">'+data.askRefundTime+'</span>').show();
                break;
            case 'RFD':
                $status.text('已退款');
                $statusInfo.append('<div class="appoint-row"><span class="tip">申请退款时间  </span><span class="val">'+data.askRefundTime+'</span></div>'+
                    '<div class="appoint-row"><span class="tip">退款时间  </span><span class="val">'+data.refundTime+'</span></div>'+
                    '<div class="appoint-row"><span class="tip">退款金额  </span><span class="val">￥'+data.refundMoney+'</span></div>').show();
                break;
            case 'RFD-OFL':
                $status.text('已退款');
                $statusInfo.append('<div class="appoint-row"><span class="tip">退款时间  </span><span class="val">'+data.refundTime+'</span></div>'+
                    '<div class="appoint-row"><span class="tip">已线下退款  </span>').show();
                break;
            case 'GFT-OVT':
                $status.text('已过期');
                break;
        }
        
    }
    var initRefund = function(){
        $('#refund').show().on('click',function(){
            location = '../user/applyRefunds.html?orderSn=' + orderSn + '&salonId=' + salonId + '&itemType=' + itemType +'&money='+amount+'&bookingSn='+bookingSn;

        })
    }
    return {
        init:init
    }
})