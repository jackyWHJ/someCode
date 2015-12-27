var orderDetail = (function(){
    var userId='', orderType='', orderId='', pageIndex=1 , pageSize=10 , pageCount=1;

    var init = function(){     
        var user = commonUtils.checkLogin();
        if(user){
            userId = user.userId;
        }else{
            return;
        }
        itemType = commonUtils.getQueryString("itemType"); 
        orderId   = commonUtils.getQueryString("orderId");  
        getOrderDetail();

        revomeEventListener();
        addEventListener(); 
    };

    var getOrderDetail = function (){
        var data = {'type':'order','to':'notPayOrderDetail','body':{}};
        data.body.userId  = userId;
        data.body.orderId = orderId;
        commonUtils.ajaxRequest({
            url  : apiConfig.orderApi,
            data : data,
            successCallback : function(obj){
                if(obj.result){
                    fillDetailData(obj.data.main);
                    commonUtils.imgError();   
                }else{
                    commonUtils.showTip(obj.msg || '获取订单详情失败！');  
                }
            }              
         });        
    };

    var revomeEventListener = function(){
        $(".order-s-pay-btn").off();
    };
    var addEventListener = function (){
       $(".order-s-pay-btn").on('click',detailPay);
    };


    var detailPay = function (e){
        var num = $(e.target).attr('ordersn');
        var isCanPay = $(e.target).attr('isCanPay');
        if(isCanPay == "1"){
            location.href = "../cart/cartOrder.html?orderSn="+num;
        }else if(isCanPay == "2"){
           commonUtils.showTip('已售罄、已下架');
        }  
    };

    var fillDetailData = function (obj){
        $("#detail_salon").text(obj.salonName);
        $("#detail_image").attr("src",obj.img);
        if(itemType == "2"){
           $("#limit_act_flag").show();
        }
        $("#detail_itemName").text(obj.itemName);
        $("#detail_choumei_price").text("￥"+obj.priceAll);
        $("#detail_ori_price").text("￥"+obj.priceOri);
        $('.order-salon-box').attr('itemId',obj.itemId);
        var useLimit = obj.useLimit;
        if(useLimit!=''){
            $('#limit_detail_info').show();
            $('#orderUserTip').text(obj.useLimit);
        }
        
        if(itemType == "2"){
            $("#detail_ori_span").hide();
        }
        if(itemType == "2" && obj.saleRule.length > 0){
           $("#limit_detail_info").show();
           obj.saleRule.forEach(function(msg){
             $(".order-buy-limit").append('<p class="before-img-bg">'+msg+'</p>').show();
           });
        }
        $("#detail_id").text(obj.orderSn);
        $("#detail_time").text(obj.addTime);
        $("#detail_g").text(obj.norms || "无规格");
        $("#detail_amt").text('￥'+obj.priceAll); 
        $(".order-s-pay-btn").attr('orderSn',obj.orderSn); 
        $(".order-s-pay-btn").attr('isCanPay',obj.isCanPay);  

        $('.order-salon-box').on('click',function(){
            var itemId =$(this).attr('itemId');
            location.href="../home/itemDetail.html?itemId="+itemId;
        });                                             
    };

    return {'Init':init};

})();

orderDetail.Init();