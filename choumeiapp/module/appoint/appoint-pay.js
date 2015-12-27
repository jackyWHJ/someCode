/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-12-05 15:41:32
 * @version $Id$
 */
define(['jquery','commonUtils'],function($,commonUtils){
    var payWay = 1, orderSn = null,payAmount = 0;
    var init = function(){

        var billData = JSON.parse(sessionStorage.getItem('appoint-bill'));

        if(!billData){
            commonUtils.alert('项目不存在，请重新预约');
            return;
        }else{
            commonUtils.addBack();
            commonUtils.addMenu();
            billData = billData.response;
            renderBill(billData);
            console.dir(billData);
            if(commonUtils.isOpenInWechat()){
                $('.pay-item:eq(0)').remove();
                payWay = 2;
                
            }else{
                $('.pay-item:eq(1)').remove();
            }
            addPayWayListener();
            addSubmitPayBtnListener();
        }
    }
    var addPayWayListener = function(){
        $('.pay-item').on('click',function(){
            var that = $(this);
            that.find('.pay-choice').addClass('select-btn');
            that.siblings().find('.pay-choice').removeClass('select-btn');
            payWay = that.attr('payWay');
        })
    }

    var renderBill = function(billData){
        var groups = billData.groups,payItems = billData.charges;
        var tmpHtml = [],itemsHtml = [];
        $.each(groups,function(key,val){
            if(val.items.length == 0){
                return;
            }
            tmpHtml.push('<div class="appoint-selected-itemWrap"><div class="title">');
            tmpHtml.push(val.groupName + '</div>');
            tmpHtml.push('<div class="content"><div class="leftCon">预约项目</div><ul class="rightCon">');
            $.each(val.items,function(key,val){
                tmpHtml.push('<li>'+ val.itemName + '</li>');
            })
            tmpHtml.push('</ul></div></div>');
        })
        $('#itemList').html(tmpHtml.join(''));

        $.each(payItems,function(key,val){
            itemsHtml.push('<div class="appoint-row"><span class="tip">');
            itemsHtml.push(val.chargeName +'</span><span class="val">￥'+val.chargeAmount+'</span></div>');
        })
        $('#payItems').html(itemsHtml.join(''));

        orderSn = billData.orderSn;
        payAmount = billData.thirdpayAmount;
        $('#date').text(billData.bookingDate);
        $('#bookerName').text(billData.bookerName);
        billData.recommendedCode?$('#recommendedCode').text(billData.recommendedCode):$('#recommendedCode').parent().hide();
        $('#totalCost').text('￥'+billData.totalAmount);
    }
   
    

    /**
     * 添加确认支付点击监听
     * */
    var addSubmitPayBtnListener = function () {
        var payUrl = "";
        
        $("#pay").off().one("click", function () {
            if (payWay == 1) {//支付定支付
                    alipay();
                }
                else if (payWay == 2) {//微信支付
                    
                    weixinPay();
                }
                else if (payWay == 3) {//易联支付
                    payeco();
                }//end payWay=3
        });
    };

    //易联支付
    var payeco = function(){
        commonUtils.request({
        url:apiConfig.newApi+"payeco/placeh5.html",
        data:{
            beautySn:""||orderSn,
            amount:""||payAmount
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
            beautySn:""||orderSn,
            amount:""||payAmount
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
            beautySn:""||orderSn,
            amount:""||payAmount
          },
        successCallback:function(data){
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
        init : init
    }
})