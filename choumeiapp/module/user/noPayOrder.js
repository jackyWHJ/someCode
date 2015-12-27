/* 
* @Author: ypl
* @Date:   2015-04-16 11:32:37
* @Last Modified by:   anchen
* @Last Modified time: 2015-04-30 09:17:25
*/

var order = (function(){
    var userId='', orderType='', orderId='', pageIndex=1 , pageSize=10 , pageCount=1;

    var init = function(){     
        var user = commonUtils.checkLogin();
        if(user){
            userId = user.userId;
        }else{
            return;
        }
        getOrderList();
        revomeEventListener();
        addEventListener(); 
    };

    var getOrderList = function(){  
        var data = {'type':'order','to':'notPayOrder','body':{}};
        data.body.userId   = userId;
        data.body.page     = pageIndex;
        data.body.pageSize = pageSize;
        commonUtils.ajaxRequest({
            url  : apiConfig.orderApi,
            data : data,
            successCallback : function(obj){
                if(obj.result){
                    if(obj.result && obj.data.main.length > 0){
                        render(obj.data.main); 
                        pageCount = parseInt((+obj.data.other.totalNum + pageSize - 1) / pageSize);
                        $(document).on("scroll",scrollEventListener);                                    
                    }else{
                        $("#order_list_id").removeClass('section-bg-color');
                        $(".no-result").show();
                    } 
                }else{
                    commonUtils.showTip(obj.msg || '获取订单列表失败！'); 
                }                                   
            }              
         });
    };
    var render = function (arr){
       var html = "";
       arr.forEach(function(row,index){
            html += '<div class="background-line"></div>';
            html += '<div class="order-start">';
            html += '<div class="order-info-des">';
            html += '<div class="order-salon-name">';
            html += '<div class="salon-name" salonId="'+row.salonId+'">'+row.salonName+'</div>';
            html += '<div class="limit-activity">';
            if(row.itemType == 2){
                html += '<img class="limit-flag" src="../../images/user/tongyong_xianshitejia@2x.png">';
            }
            html += '</div></div>';

            html += '<div class="gray-line"></div>';
            html += '<div class="order-salon-title" orderId="'+row.orderId+'" itemType="'+row.itemType+'">';
            html += '<div class="salon-image-box"><img class="salon-image" src="'+row.img+'"></div>';
            html += '<div class="act-des-box">';
            html += '<div class="act-name" itemId="'+row.itemId+'">'+row.itemName+'</div>';
            html += '<div class="act-norms">'+(row.norms ||'无规格')+'</div>';
            html += '<div class="act-price">';
            html += '<p >臭美价：<span class="font-color">￥'+row.priceAll+'</span>';
            if(row.itemType == 1){
                html += '<span class="price-span">原价：￥'+row.priceOri+'</span>';    
            }                            
            html += '</p></div></div></div>';
            html += '<div class="gray-line"></div>';
            html += '<div class="order-salon-pay">';
            if(row.isCanPay == 1){
                if(row.repertory > 0){
                    html += '<div class="inventory-num"><span>库存：'+row.repertory+'</span></div>';
                }else{
                    //html += '<div class="inventory-num"><span>库存：不限</span></div>';
                }
                html += '<div class="order-pay-btn" ordersn="'+row.orderSn+'">付款</div>';    
            }else if(row.isCanPay == 2){
                html += '<div class="inventory-num gray"><span>已售罄</span></div>';
                html += '<div class="order-pay-btn pay-gray">付款</div>';    
            }                   
            html += '</div></div>';
            html += '<div class="order-info-del" orderId="'+row.orderId+'">'; 
            html += '<span class="del-btn-text">删除</span></div></div>';  
       },this);
       $(".order-list-box").append(html); 
       commonUtils.imgError();     
    };

    var revomeEventListener = function(){
        $(".order-list-box").off();
    };

    var addEventListener = function (){
       $(".order-list-box").delegate('.order-salon-name', 'click', showRemoveButton);
       $(".order-list-box").delegate('.order-info-del',   'click', removeOrder);
       $(".order-list-box").delegate('.order-salon-title','click', showOrderDetail);
       $(".order-list-box").delegate('.order-pay-btn',    'click', pay);
    };

    var scrollEventListener = function (){
        var domHeight = $(document).height();
        var scrollTopHeight = $(document).scrollTop();
        var windowHeight =  $(window).height();
        if(scrollTopHeight + windowHeight >= domHeight){
            if(pageIndex < pageCount){
                pageIndex ++;
                getOrderList();
            }
        }     
    };

    var showRemoveButton = function(e){
        var parentNode = $(e.currentTarget.parentNode);
        var removeNode = parentNode.next();
        if(removeNode.css("display") == "block"){            
            removeNode.fadeOut('slow',function(){
                parentNode.removeClass('right-move');
            });
        }else{
            parentNode.addClass("right-move");
            removeNode.fadeIn('slow');
        }
    };

    var showOrderDetail = function (e){
        var orderId = $(e.currentTarget).attr('orderId');
        var itemType = $(e.currentTarget).attr('itemType');
       // location.href = "noPayOrder.html#orderDetail?orderId="+orderId+'&orderType='+itemType;
        location.href = "noPayOrderDetail.html?orderId="+orderId+'&itemType='+itemType;
    };

    var pay = function(e){
        var t = $(e.target);
        var num = t.attr("ordersn");
        if(!t.hasClass('pay-gray')){
             location.href = "../cart/cartOrder.html?orderSn="+num;
        }
    };

    var removeOrder = function (e){
       var currentNode = $(e.currentTarget); 
       var data = {'type':'order','to':'deleteOrder','body':{}};
       data.body.userId  =  userId;
       data.body.orderId = currentNode.attr('orderId');            
       commonUtils.confirm("你确定要删除吗？",function(isOk){
          if(isOk){
            commonUtils.ajaxRequest({
                url  : apiConfig.orderApi,            
                data : data,
                successCallback : function(obj){
                    if(obj.result){
                        currentNode.parent().prev().remove(); // 删除.background-line
                        currentNode.parent().remove();        // 删除.order-start
                        if($('.order-list-box').children().length == 0){
                            $("#order_list_id").removeClass("section-bg-color");
                            $(".no-result").show();
                        }
                    }else{
                        commonUtils.showTip(obj.msg || '订单删除失败！');  
                        currentNode.fadeOut('slow',function(){
                            currentNode.prev().removeClass('right-move');
                        });                 
                    }
                }              
            });                 
          }else{
            currentNode.fadeOut('slow',function(){
                currentNode.prev().removeClass('right-move');
            });             
          }
       });    
       
    };
    return {'Init':init};

})();

order.Init();